export class Organization {
  _id: string;
  name: string;
  domain: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  primaryPhone: string;
  parent: string;

  services: Array<{
    service: any,
    enabled: boolean
  }>;

  constructor() {
    this.address = {
      line1: '',
      line2: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    };
  }
}
