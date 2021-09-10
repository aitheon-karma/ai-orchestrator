import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { RestService } from '@aitheon/core-client';

import { Organization } from './organization';

@Injectable({
  providedIn: 'root'
})
export class OrganizationsService {

  constructor(private restService: RestService) { }

  getOrg(id: number): Observable<Organization> {
    return this.restService.fetch(`/api/organizations/${ id }`);
  }

  list(): Observable<Organization[]> {
    return this.restService.fetch(`/api/me/organizations`);
  }

  create(organization: Organization): Observable<Organization> {
    return this.restService.post(`/api/organizations`, organization);
  }

  update(organization: Organization): Observable<Organization> {
    return this.restService.put(`/api/organizations/${ organization._id }`, organization);
  }

  addService(organizationId: string, serviceId: string): Observable<Organization> {
    return this.restService.post(`/api/organizations/${organizationId}/services/${ serviceId }`, {});
  }

  removeService(organizationId: string, serviceId: string): Observable<Organization> {
    return this.restService.delete(`/api/organizations/${organizationId}/services/${ serviceId }`);
  }

  publicProfile(organizationId: string): Observable<Organization[]> {
    return this.restService.fetch(`/api/organizations/${organizationId}/public-profile`);
  }

  removeCoverImage(organizationId: string): Observable<any> {
    return this.restService.put(`/api/organizations/${organizationId}/public-profile/removeCoverImage`, {});
  }

  updateIntro(organizationId: string, intro: Object): Observable<any> {
    return this.restService.put(`/api/organizations/${organizationId}/public-profile/intro`, intro);
  }

  removeAvatar(organizationId: string): Observable<any> {
    return this.restService.put(`/api/organizations/${organizationId}/public-profile/removeAvatarImage`, {});
  }

  updateOrganizationGeneralInfo(organizationId: string, generalInfo: Object): Observable<any> {
    return this.restService.put(`/api/organizations/${organizationId}/public-profile/updateGeneralInfo`, generalInfo);
  }

  followOrganization(organizationId: string): Observable<any> {
    return this.restService.post(`/api/organizations/${organizationId}/public-profile/follow`, {});
  }

  unfollowOrganization(organizationId: string): Observable<any> {
    return this.restService.delete(`/api/organizations/${organizationId}/public-profile/follow`);
  }

  getfollowingStatus(organizationId: string): Observable<any> {
    return this.restService.fetch(`/api/organizations/${organizationId}/public-profile/follow`);
  }

  getOrganizationFollowers(organizationId: string): Observable<any> {
    return this.restService.fetch(`/api/organizations/${organizationId}/public-profile/organizationfollowers`);
  }
}
