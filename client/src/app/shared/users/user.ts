import { UserRole } from './user-role';

export class User {
  _id: string;
  email: string;
  password: string;
  KYCStatus: KYCStatus;
  profile: {
    firstName: string;
    lastName: string;
    birthday: string;
    avatarUrl: string;
    currentAddress: Address;
    homeAddress: Address;
    phoneNumber: string;
    headline: string;
    gender: string;
    maritalStatus: string;
    languages: Array<string>;
    interests: Array<string>;
    politicalViews: Array<string>;
    socialProfiles: {
      twitter: string,
      instagram: string,
    }
  };
  personal: {
    intro: string;
    coverImageUrl: string;
    introBackgroundStyle: string;
    introTextStyle: string;
  };
  professional: {
    intro: string;
    coverImageUrl: string;
    introBackgroundStyle: string;
    introTextStyle: string;
  };
  dating: {
    intro: string;
    coverImageUrl: string;
    introBackgroundStyle: string;
    introTextStyle: string;
  };
  permissions: UserViewPermissions;
  fieldAccessibility: FieldAccessibility;
  disabled: boolean;
  roles: Array<UserRole>;
  organizationRole: UserRole;
  services: Array<string>;
  updatedAt: string;
  unsubscribedEmail: boolean;
  emailVerified: boolean;
  tabAccessibility: TabAccessibility;

  constructor() {
    this.profile = {
      lastName: '',
      firstName: '',
      birthday: '',
      avatarUrl: '',
      phoneNumber: '',
      headline: '',
      currentAddress: new Address(),
      gender: '',
      homeAddress: new Address(),
      interests: [],
      languages: [],
      maritalStatus: '',
      politicalViews: [],
      socialProfiles: null
    };
    this.disabled = false;
    this.roles = [];
    this.services = [];
  }
}

export enum KYCStatus {
  'NONE', // have not uploaded documents
  'PENDING', // Documents uploaded, waiting for image recognition of ID
  'IMAGE_VERIFIED', // Images matched ID
  'VERIFY_FINISHED', // kyc background check run on verified ID and passed
  'DENIED_IMAGE', // Documents failed Image recognition
  'DENIED_BACKGROUND'
}

export class Address {
  addressLine1: string;
  addressLine2: string;
  city: string;
  regionState: string;
  country: string;
  code: string;
}

export class UserViewPermissions {
  personalView: {
    personal: boolean;
    professional: boolean;
    dating: boolean;
  };
  organizationalView: {
    personal: boolean;
    professional: boolean;
    dating: boolean;
  };
  datingView: {
    personal: boolean;
    professional: boolean;
    dating: boolean;
  };
  constructor() {
    this.personalView = {
      personal: true,
      professional: false,
      dating: false
    };
    this.organizationalView = {
      personal: false,
      professional: true,
      dating: false
    };
    this.datingView = {
      personal: false,
      professional: false,
      dating: true
    };
  }
}

export class AddressAccessibility {
  addressLine1: boolean;
  addressLine2: boolean;
  city: boolean;
  regionState: boolean;
  country: boolean;
  code: boolean;
  constructor() {
    this.addressLine1 = true;
    this.addressLine2 = true;
    this.city = true;
    this.regionState = true;
    this.country = true;
    this.code = true;
  }
}

export class FieldAccessibility {
  email: AccessibilitySpecs;
  firstName: boolean;
  lastName: boolean;
  birthday: AccessibilitySpecs;
  phoneNumber: AccessibilitySpecs;
  headline: boolean;
  gender: AccessibilitySpecs;
  maritalStatus: AccessibilitySpecs;
  languages: AccessibilitySpecs;
  interests: AccessibilitySpecs;
  politicalViews: AccessibilitySpecs;
  currentAddress: {
    addressLine1: AccessibilitySpecs;
    addressLine2: AccessibilitySpecs;
    city: AccessibilitySpecs;
    code: AccessibilitySpecs;
    country: AccessibilitySpecs;
    regionState: AccessibilitySpecs;
  };
  homeAddress: {
    addressLine1: AccessibilitySpecs;
    addressLine2: AccessibilitySpecs;
    city: AccessibilitySpecs;
    code: AccessibilitySpecs;
    country: AccessibilitySpecs;
    regionState: AccessibilitySpecs;
  };
  socialProfiles_twitter: AccessibilitySpecs;
  socialProfiles_instagram: AccessibilitySpecs;

  constructor() {
    this.email = new AccessibilitySpecs();
    this.firstName = true;
    this.lastName = true;
    this.birthday = new AccessibilitySpecs();
    this.phoneNumber = new AccessibilitySpecs();
    this.headline = true;
    this.gender = new AccessibilitySpecs();
    this.maritalStatus = new AccessibilitySpecs();
    this.languages =  new AccessibilitySpecs();
    this.interests = new AccessibilitySpecs();
    this.politicalViews = new AccessibilitySpecs();
    this.currentAddress = {
      addressLine1: new AccessibilitySpecs(),
      addressLine2: new AccessibilitySpecs(),
      city: new AccessibilitySpecs(),
      code: new AccessibilitySpecs(),
      country: new AccessibilitySpecs(),
      regionState: new AccessibilitySpecs()
    };
    this.homeAddress = {
      addressLine1: new AccessibilitySpecs(),
      addressLine2: new AccessibilitySpecs(),
      city: new AccessibilitySpecs(),
      code: new AccessibilitySpecs(),
      country: new AccessibilitySpecs(),
      regionState: new AccessibilitySpecs()
    };
    this.socialProfiles_twitter = new AccessibilitySpecs();
    this.socialProfiles_instagram = new AccessibilitySpecs();
  }
}

export class AccessibilitySpecs {
  public_personal: Boolean;
  public_professional: Boolean;
  connections: Boolean;
  contacts: Boolean;
  only_me: Boolean;

  constructor() {
    this.public_personal = false;
    this.public_professional = false;
    this.connections = false;
    this.contacts = false;
    this.only_me = true;
  }
}

export class TabAccessibility {
  feed: Boolean;
  timeline: Boolean;
  connections: Boolean;
  contactInfo: Boolean;
  images: Boolean;
  videos: Boolean;
  experience: Boolean;
  following: Boolean;

  constructor() {
    this.feed = true;
    this.timeline = true;
    this.connections = true;
    this.contactInfo = true;
    this.images = true;
    this.videos = true;
    this.experience = true;
    this.following = true;
  }
}
