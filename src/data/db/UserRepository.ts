import S3 from 'aws-sdk/clients/s3';
import isEmail from 'isemail';
import mime from 'mime';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import uuidv4 from 'uuid/v4';
import { DataSource } from 'apollo-datasource';
import db from './db';
import { User, Trip } from '@prisma/client';
import { storageBucket } from '@config';

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  initialize(config: any): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.context = config.context;
  }

  /**
   * Creates a new user
   * @param {string} email User's email address
   */
  async createUser(email: string): Promise<User> {
    if (!email || isEmail.validate(email)) {
      return null;
    }

    const user = await db.user.create({
      data: {
        identifier: uuidv4(),
        email,
        token: new Buffer(email).toString('base64'),
      },
    });
    return user;
  }

  /**
   * Gets a user. This checks the current context. & if that user is already in the given context.
   * They will be used to retrieve their full detail
   * @param {string} email User's email address
   */
  async getUser(email?: string): Promise<User> {
    const emailAddress = this.context && this.context.user ? this.context.user.email : email;

    if (!emailAddress || isEmail.validate(emailAddress)) {
      return null;
    }

    const user = await db.user.findOne({
      where: {
        email,
      },
    });
    return user;
  }

  /**
   * Allows a user to book several trips
   * @param launchIds Array of launch IDs
   */
  async bookTrips(launchIds: number[]): Promise<Trip[]> {
    const userId = this.context.user.identifier;

    if (!userId) {
      return;
    }

    const bookedTrips: Trip[] = [];

    for (const launchId of launchIds) {
      const trip = await this.bookTrip(launchId);
      if (trip) {
        bookedTrips.push(trip);
      }
    }

    return bookedTrips;
  }

  /**
   * Books a trip for a user
   * @param {Number} launchId Launch ID
   */
  async bookTrip(launchId: number): Promise<Trip> {
    const userId = this.context.user.identifier;

    const createdTrip = await db.trip.create({
      data: {
        identifier: uuidv4(),
        launchId,
        user: userId,
      },
    });

    return createdTrip;
  }

  /**
   * Allows a user to cancel a trip
   * @param {Number} launchId Launch ID
   */
  async cancelTrip(launchId: number): Promise<Trip> {
    const userId = this.context.user.identifier;

    if (!userId) {
      return null;
    }

    const user = await db.user.findOne({ where: { identifier: userId } });

    const deletedTrip = await db.trip.delete({
      include: {
        user: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          select: { id: user.id },
        },
      },
      where: {
        launchId,
      },
    });

    return deletedTrip;
  }

  /**
   * Retrieves all the launch Ids for the given user
   */
  async getLaunchIdsByUser(): Promise<number[]> {
    const userId = this.context.user.identifier;
    const foundTrips = await db.trip.findMany({
      where: {
        user: {
          identifier: userId,
        },
      },
    });

    return foundTrips.map((trip) => trip.launchId);
  }

  /**
   *
   * @param {number} launchId Launch ID
   */
  async isBookedOnLaunch(launchId: number): Promise<boolean> {
    if (!this.context || !this.context.user) return false;
    const userId = this.context.user.identifier;
    const foundTrips = await db.trip.findMany({
      where: {
        launchId,
        user: {
          identifier: userId,
        },
      },
    });

    return foundTrips && foundTrips.length > 0;
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
  }
}
