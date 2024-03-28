import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { ZoomMtg } from '@zoom/meetingsdk';

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  signatureEndpoint = 'https://26040c9x85.execute-api.us-west-1.amazonaws.com/default/meetingsdk'
  sdkKey = 'viodIoBwGbXY8HfsCADKrAIqOgdLuwLNPVUI'
  meetingNumber = ''
  role = 0
  leaveUrl = 'https://tommygaessler.com/client-view'
  userName = 'Zoom Meeting SDK'
  userEmail = ''
  passWord = ''
  registrantToken = ''
  zakToken = ''

  constructor(public httpClient: HttpClient, @Inject(DOCUMENT) document, private activatedRoute: ActivatedRoute, private ngZone: NgZone) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.meetingNumber = params['meeting'];
      this.passWord = params['passcode'];
    });
  }

  ngOnInit() {

  }

  getSignature() {
    this.httpClient.post(this.signatureEndpoint, JSON.stringify({
	    meetingNumber: this.meetingNumber,
	    role: this.role
    })).toPromise().then((data: any) => {
      if(data.signature) {
        this.startMeeting(data.signature)
      } else {
        console.log(data)
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  startMeeting(signature) {

    document.getElementById('zmmtg-root').style.display = 'block'

    this.ngZone.runOutsideAngular(() => {
      ZoomMtg.init({
        leaveUrl: this.leaveUrl,
        patchJsMedia: true,
        success: (success) => {
          console.log(success)
          ZoomMtg.join({
            signature: signature,
            meetingNumber: this.meetingNumber,
            userName: this.userName,
            sdkKey: this.sdkKey,
            userEmail: this.userEmail,
            passWord: this.passWord,
            tk: this.registrantToken,
            zak: this.zakToken,
            success: (success) => {
              console.log(success)
            },
            error: (error) => {
              console.log(error)
            }
          })
        },
        error: (error) => {
          console.log(error)
        }
      })
    })
  }
}
