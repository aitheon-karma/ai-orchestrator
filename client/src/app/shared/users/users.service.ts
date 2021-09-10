import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { RestService } from '@aitheon/core-client';
import { environment } from '../../../environments/environment';
import { User } from './user';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private restService: RestService,
    private http: Http) { }

  list(organizationId: string): Observable<User[]> {
    return this.restService.fetch(`/api/organizations/${organizationId}/users`);
  }

  listInvites(organizationId: string): Observable<User[]> {
    return this.restService.fetch(`/api/organizations/${organizationId}/users/invites`);
  }

  publicProfile(userId: string): Observable<User[]> {
    return this.restService.fetch(`/api/users/${userId}/public-profile`);
  }

  inviteToOrganization(organizationId: string, user: User): Observable<User> {
    return this.restService.post(`/api/organizations/${organizationId}/users/invites`, user);
  }

  cancelInvite(organizationId, inviteId): Observable<any> {
    return this.restService.delete(`/api/organizations/${organizationId}/users/invites/${inviteId}`);
  }

  update(organizationId: string, user: User, personal: boolean, otpCode: string): Observable<User> {
    let url = personal ? '/api/users/profile' : `/api/organizations/${organizationId}/users/${user._id}`;
    url += `?otpCode=${otpCode}`;
    return this.restService.put(url, user);
  }

  addService(serviceId: string): Observable<any> {
    return this.restService.put(`/api/users/me/services/${serviceId}`, {});
  }

  removeService(serviceId: string): Observable<any> {
    return this.restService.delete(`/api/users/me/services/${serviceId}`);
  }

  signup(user: User): Observable<User> {
    return this.restService.post(`/api/users/signup`, user);
  }

  changePassword(request: { currentPassword: string, password: string }, otpCode: string): Observable<any> {
    return this.restService.post(`/api/users/change-password?otpCode=${otpCode}`, request);
  }

  search(conditions: { search: string}): Observable<User[]> {
    return this.restService.fetch(`${environment.baseApi}/users/api/users/profile/search`, conditions, true);
  }

  resetPassword(token: string, password: string): Observable<{ email: string }> {
    return this.restService.post(`/api/users/reset-password/${token}/`, { password: password });
  }

  forgotPassword(email: string): Observable<void> {
    return this.restService.post(`/api/users/forgot-password`, { email: email });
  }

  unlinkTelegram(): Observable<void> {
    return this.restService.delete(`/api/users/telegram`);
  }

  changeNotifications(unsubscribedEmail: boolean): Observable<void> {
    return this.restService.post(`/api/users/me/notifications`, { unsubscribedEmail: unsubscribedEmail });
  }

  resendVerifyEmail(): Observable<void> {
    return this.restService.post(`/api/users/verify-email`, {});
  }

  deleteAccount(otpCode?: string): Observable<void> {
    let url = `/users/me`;
    url += `?otpCode=${otpCode}`;
    return this.restService.delete(url);
  }

  showDevicesPin(otpCode?: string): Observable<any> {
    return this.restService.fetch(`/api/users/me/devices-pin`, { otpCode });
  }

  countriesList(): Observable<any> {
    return this.restService.fetch(`/api/common/countries/getCountries`);
  }

  profileDetail(): Observable<any> {
    return this.restService.fetch(`/api/users/me/profile-detail`);
  }

  removeAvatar(): Observable<any> {
    return this.restService.put(`/api/users/profile/avatar/remove`, {});
  }

  updateIntro(profileType: String, intro: Object): Observable<any> {
    return this.restService.put(`/api/users/profile/${profileType}/intro`, intro);
  }

  removeCoverImage(profileTypeId: any): Observable<any> {
    return this.restService.put('/api/users/profile/' + profileTypeId + '/removeCoverImage', {});
  }

  updatePermissions(permissions: any): Observable<any> {
    return this.restService.put('/api/users/profile/permissions', permissions);
  }

  updateTabAccessibility(tabAccessibility: any): Observable<any> {
    return this.restService.put('/api/users/profile/tabAccessibility', {
      'tabAccessibility': tabAccessibility
    });
  }

  addFeed(viewType: number, feed: any): Observable<any> {
    return this.restService.post(`/api/users/feed/${viewType}`, feed);
  }

  feeds(userId: string, viewType: number, pageNo: Object): Observable<any> {
    return this.restService.fetch(`/api/users/${userId}/feeds/${viewType}/${pageNo}`);
  }

  timelines(userId: string, viewType: number): Observable<any> {
    return this.restService.fetch(`/api/users/${userId}/timelines/${viewType}`);
  }

  extractURLData(targetUrl: string): Observable<any> {
    return this.restService.post(`/api/users/feed/extractURLData`, { targetUrl });
  }

  removeFeed(feedId: string): Observable<any> {
    return this.restService.delete(`/api/users/feed/${feedId}`);
  }

  updateFeedImage(feedId: any, imageUrl: any, contentType: string): Observable<any> {
    return this.restService.put('/api/users/feed/' + feedId + '/attachment', {
      url: imageUrl,
      contentType: contentType
    });
  }

  updateFeed(updateFeedRequest: any): Observable<any> {
    return this.restService.put(`/api/users/feed/${updateFeedRequest.feed._id}`, updateFeedRequest);
  }

  unlinkInstagram(): Observable<any> {
    return this.restService.delete(`/api/users/instagram`);
  }

  getInstagramImages(userId: string): Observable<any> {
    return this.restService.fetch(`/api/users/instagram/${userId}/images`);
  }

  getauthGoogle(): Observable<any> {
    return this.restService.fetch(`/api/users/videos/authGoogle`);
  }
  getPlaylist(userId: string): Observable<any> {
    return this.restService.fetch(`/api/users/videos/getPlaylist/${userId}`);
  }

  unlinkYoutube(): Observable<any> {
    return this.restService.delete(`/api/users/videos/unlinkYoutube`);
  }

  getFollowingOrganizations(userId: string): Observable<any> {
    return this.restService.fetch(`/api/users/${userId}/organizations`);
  }
}
