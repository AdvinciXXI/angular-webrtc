import { Component, OnInit, ViewChild } from '@angular/core';
// import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
// import * as firebase from "firebase/app";

@Component({
  selector: 'app-web-rtc',
  templateUrl: './web-rtc.component.html',
  styleUrls: ['./web-rtc.component.scss']
})
export class WebRtcComponent implements OnInit {
  title = 'angular-webrtc';
  callActive: boolean = false;
  rtcConfig: RTCConfiguration = {
    bundlePolicy: undefined,
    certificates: [],
    iceCandidatePoolSize: 10,
    iceServers: [
      { urls: "stun:stun.services.mozilla.com" },
      { urls: "stun:stun.l.google.com:19302" }
    ],
    iceTransportPolicy: undefined,
    rtcpMuxPolicy: undefined
  };
  pc: RTCPeerConnection = new RTCPeerConnection(this.rtcConfig);

  localStream: any;
  // channel: AngularFireList<{}>;
  // database: firebase.database.Reference;
  senderId: string = "";

  @ViewChild("local") local: any;
  @ViewChild("remote") remote: any;

  constructor(
    //private afDb: AngularFireDatabase,
  ) { }

  async ngOnInit() {
    await this.setupWebRtc();
  }

  public ngOnDestroy() {
    this.pc.close();
    let tracks = this.localStream.getTracks();

    for (let i = 0; i < tracks.length; i++) {
      tracks[i].stop();
    }

    this.callActive = false;
  }

  async setupWebRtc() {
    this.senderId = this.guid();
    var channelName = "/webrtc";
    // this.channel = this.afDb.list(channelName);
    // this.database = this.afDb.database.ref(channelName);
    // this.database.on("child_added", this.readMessage.bind(this));

    // this.pc.onicecandidate = event => {
    //   event.candidate ? this.sendMessage(this.senderId, JSON.stringify({ ice: event.candidate })) : console.log("Sent All Ice");
    // }

    // this.pc.onremovestream = event => {
    //   console.log('Stream Ended');
    // }

    this.pc.ontrack = event =>
      (this.remote.nativeElement.srcObject = event.streams[0]); // use ontrack
  }

  async showLocal() {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then(stream => (this.local.nativeElement.srcObject = stream))
      .then(stream => {
        //this.pc.addStream(stream);

        this.localStream = stream;

        this.callActive = true;
      });
  }

  async showRemote() {
    await this.showLocal();

    try {
      this.pc.createOffer()
        .then((offer: any) => this.pc.setLocalDescription(offer))
        .then(() => {
          //this.sendMessage(this.senderId, JSON.stringify({ sdp: this.pc.localDescription }));

          this.callActive = true;
        });
    } catch (error) {
      console.log(error);
    }
  }

  hangup() {
    this.pc.close();
    let tracks = this.localStream.getTracks();

    for (let i = 0; i < tracks.length; i++) {
      tracks[i].stop();
    }

    this.callActive = false;
  }

  // sendMessage(senderId: string, data: string) {
  //   var msg = this.channel.push({ sender: senderId, message: data });
  //   msg.remove();
  // }

  // readMessage(data: any) {
  //   if (!data) return;
  //   try {
  //     var msg = JSON.parse(data.val().message);
  //     let personalData = data.val().personalData;
  //     var sender = data.val().sender;

  //     if (sender != this.senderId) {
  //       if (msg.ice != undefined && this.pc != null) {
  //         this.pc.addIceCandidate(new RTCIceCandidate(msg.ice));
  //       } else if (msg.sdp.type == "offer") {
  //         this.callActive = true;
  //         this.pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
  //           .then(() => this.pc.createAnswer())
  //           .then((answer: any) => this.pc.setLocalDescription(answer))
  //           .then(() => this.sendMessage(this.senderId, JSON.stringify({ sdp: this.pc.localDescription })));
  //       } else if (msg.sdp.type == "answer") {
  //         this.callActive = true;
  //         this.pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  guid() {
    return (this.s4() + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + this.s4() + this.s4());
  }
  s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
}
