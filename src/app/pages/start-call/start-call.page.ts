import { Component, OnDestroy } from '@angular/core';
import { CallService } from '../../core/services/call.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-call',
  templateUrl: './start-call.page.html',
  styleUrls: ['./start-call.page.scss'],
  standalone: false,
})
export class StartCallPage {
  meetingId: string = '';
  name: string = '';
  callername: string = '';

  constructor(private callService: CallService, private router: Router) {}

  ionViewWillEnter() {
    const navigation = history.state;
    this.meetingId = navigation.meetingId || '';
    this.callername = navigation.callerName || 'start call';
    this.name = 'Jose Jose';
  }

  async acceptCall() {
    this.callService
      .acceptIncomingCall(this.meetingId, this.name)
      .then(() => this.router.navigate(['/home']));
  }

  async rejectCall() {
    await this.callService.cancelCall();
  }
}
