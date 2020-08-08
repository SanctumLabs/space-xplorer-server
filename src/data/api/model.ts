// ref https://github.com/r-spacex/SpaceX-API

type Core = {
  core_serial: string;
  flight: number;
  block?: number;
  gridfins: boolean;
  legs: boolean;
  reused: boolean;
  land_success?: any;
  landing_intent: boolean;
  landing_type?: any;
  landing_vehicle?: any;
};

type OrbitParams = {
  reference_system: string;
  regime: string;
  longitude?: number;
  semi_major_axis_km?: number;
  eccentricity?: null;
  periapsis_km: number;
  apoapsis_km: number;
  inclination_deg: number;
  period_min?: number;
  lifespan_years?: number;
  epoch?: number;
  mean_motion?: number;
  raan?: number;
  arg_of_pericenter?: number;
  mean_anomaly?: number;
};

type Payload = {
  payload_id: string;
  norad_id: string[];
  reused: boolean;
  customers: string[];
  nationality: string;
  manufacturer: string;
  payload_type: string;
  payload_mass_kg: number;
  payload_mass_lbs: number;
  orbit: string;
  orbitParams: OrbitParams;
};

type FirstStage = {
  cores: Core[];
};

type SecondStage = {
  block: number;
  payloads: Payload[];
};

type Fairings = {
  reused: boolean;
  recovery_attempt: boolean;
  recovered: boolean;
  ship?: any;
};

type Rocket = {
  rocket_id: string;
  rocket_name: string;
  rocket_type: string;
  first_stage: FirstStage;
  second_stage: SecondStage;
  fairings?: Fairings;
};

type Telemetry = {
  flight_club?: string;
};

type Reuse = {
  core: boolean;
  side_core1: boolean;
  side_core2: boolean;
  fairings: boolean;
  capsule: boolean;
};

type LaunchSite = {
  site_id: string;
  site_name: string;
  site_name_long: string;
};

type LaunchFailureDetails = {
  time: number;
  altitude?: number;
  reason: string;
};

type Link = {
  mission_patch: string;
  mission_patch_small?: string;
  reddit_campaign?: string;
  reddit_launch?: string;
  reddit_recovery?: string;
  reddit_media?: string;
  presskit?: string;
  article_link?: string;
  wikipedia?: string;
  video_link: string;
  youtube_id: string;
  flickr_images: string[];
};

type Timeline = {
  webcast_liftoff: number;
};

export type Launch = {
  flight_number: number;
  mission_name: string;
  mission_id: string[];
  upcoming: boolean;
  launch_year: string;
  launch_date_unix: number;
  launch_date_utc: string;
  launch_date_local: string;
  is_tentative: boolean;
  tentative_max_precision: string;
  tbd: boolean;
  launch_window: number;
  rocket: Rocket;
  ships: string[];
  telemetry: Telemetry;
  reuse: Reuse;
  launch_site: LaunchSite;
  launch_success: boolean;
  launch_failure_details: LaunchFailureDetails;
  links: Link;
  details: string;
  static_fire_date_utc?: number;
  static_fire_date_unix?: number;
  timeline?: Timeline;
  crew?: string[];
};
