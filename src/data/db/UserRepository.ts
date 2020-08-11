/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import S3 from 'aws-sdk/clients/s3';
import isEmail from 'isemail';
import mime from 'mime';
import { v4 as uuidv4 } from 'uuid';
import { DataSource } from 'apollo-datasource';
import db from './db';
import { User, Trip } from '@prisma/client';
import { storageBucket } from '@config';
import logger from '@logger';

export default class UserRepository extends DataSource {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private context: any;

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   * @param {object} config Config passed in from ApolloServer
   */
  initialize(config: any): void {
    this.context = config.context;
  }

  /**
   * Creates a new user
   * @param {string} email User's email address
   */
  async createUser(email: string): Promise<User> {
    try {
      if (!email || !isEmail.validate(email)) {
        logger.error(`Email not provided or is invalid. Can't create user. Email: ${email}`);
        return null;
      }

      const user = await db.user.create({
        data: {
          identifier: uuidv4().toString(),
          email,
          token: Buffer.from(email).toString('base64'),
        },
      });
      return user;
    } catch (error) {
      logger.error(`Failed to create user with error ${error}`);
      return null;
    }
  }

  /**
   * Gets a user. This checks the current context. & if that user is already in the given context.
   * They will be used to retrieve their full detail
   * @param {string} email User's email address
   */
  async getUser(email?: string): Promise<User> {
    try {
      const emailAddress = this.context && this.context.user ? this.context.user.email : email;

      if (!emailAddress || !isEmail.validate(emailAddress)) {
        logger.error(`Can't retrieve user. UserContext: ${this.context.user}, Email: ${email}`);
        return null;
      }

      const user = await db.user.findOne({
        where: {
          email,
        },
      });
      return user;
    } catch (error) {
      logger.error(`Failed to get user with error ${error}`);
      return null;
    }
  }

  /**
   * Allows a user to book several trips
   * @param launchIds Array of launch IDs
   */
  async bookTrips(launchIds: number[]): Promise<Trip[]> {
    const userId = this.context.user.identifier;
    logger.info(`Booking trips ${launchIds} for user ${userId}`);
    if (!userId) {
      logger.error(`Failed to book trips for user. User not available in context`);
      return;
    }

    try {
      const bookedTrips: Trip[] = [];

      for (const launchId of launchIds) {
        const trip = await this.bookTrip(launchId);
        if (trip) {
          bookedTrips.push(trip);
        }
      }

      return bookedTrips;
    } catch (error) {
      logger.error(`Failed to book trips for user ${userId} with error ${error}`);
      return null;
    }
  }

  /**
   * Books a trip for a user
   * @param {Number} launchId Launch ID
   */
  async bookTrip(launchId: number): Promise<Trip> {
    const userId = this.context.user.identifier;
    logger.info(`Booking trip ${launchId} for User: ${userId} ...`);

    try {
      const createdTrip = await db.trip.create({
        data: {
          identifier: uuidv4(),
          launchId,
          user: {
            connect: {
              identifier: userId,
            },
          },
        },
      });

      return createdTrip;
    } catch (error) {
      logger.error(`Failed to book trip ${launchId} for user ${userId} with error ${error}`);
      return null;
    }
  }

  /**
   * Allows a user to cancel a trip
   * @param {Number} launchId Launch ID
   */
  async cancelTrip(launchId: number): Promise<Trip> {
    const userId = this.context.user.identifier;
    logger.info(`Cancelling trip ${launchId} for User: ${userId} ...`);

    if (!userId) {
      logger.info(`Failed to cancel trip ${launchId} for User: ${userId} ...`);
      return null;
    }

    try {
      const deletedTrip = await db.trip.delete({
        include: {
          user: {
            select: { id: true },
          },
        },
        where: {
          launchId,
        },
      });

      return deletedTrip;
    } catch (error) {
      logger.error(`Failed to cancel trip for user with error ${error}`);
      return null;
    }
  }

  /**
   * Retrieves all the launch Ids for the given user
   */
  async getLaunchIdsByUser(): Promise<number[]> {
    const userId = this.context.user.identifier;
    logger.info(`Getting launchIds for User: ${userId} ...`);

    try {
      const foundTrips = await db.trip.findMany({
        where: {
          user: {
            identifier: userId,
          },
        },
      });

      logger.debug(`Found trips ${foundTrips} for User: ${userId} ...`);

      return foundTrips.map((trip) => trip.launchId);
    } catch (error) {
      logger.error(`Failed to get launch IDs for user ${userId} with error ${error}`);
      return [];
    }
  }

  /**
   *Checks if the current trip is booked
   * @param {number} launchId Launch ID
   */
  async isBookedOnLaunch(launchId: number): Promise<boolean> {
    if (!this.context || !this.context.user) return false;
    const userId = this.context.user.identifier;

    try {
      const foundTrip = await db.trip.findOne({
        where: {
          launchId,
        },
        include: {
          user: {
            select: {
              identifier: userId,
            },
          },
        },
      });

      return foundTrip !== null || foundTrip !== undefined;
    } catch (error) {
      logger.error(`Failed to check if Trip ${launchId} is booked for user ${userId}`);
      return false;
    }
  }

  /**
   * This function is currently only used by the iOS tutorial to upload a
   * profile image to S3 and update the user row
   * @param file Profile image
   */
  // TODO: set type
  async uploadProfileImage(file: any): Promise<User> {
    const userId = this.context.user.identifier;
    if (!userId) return;

    try {
      // Create new S3 client instance
      const s3 = new S3();

      /**
       * Destructure mimetype and stream creator from provided file and generate
       * a unique filename for the upload
       */
      const { createReadStream, mimetype } = await file;
      const filename = uuidv4() + '.' + mime.getExtension(mimetype);

      // Upload the file to an S3 bucket using the createReadStream
      await s3
        .upload({
          ACL: 'public-read', // This will make the file publicly available
          Body: createReadStream(),
          Bucket: storageBucket,
          Key: filename,
          ContentType: mimetype,
        })
        .promise();

      // Save the profile image URL in the DB and return the updated user
      const updatedUser = await db.user.update({
        where: {
          identifier: userId,
        },
        data: {
          profileImage: `https://${storageBucket}.s3.us-west-2.amazonaws.com/${filename}`,
        },
      });
      return updatedUser;
    } catch (error) {
      logger.error(`Failed to upload image for user ${userId} with error ${error}`);
      return null;
    }
  }
}
