import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { DomSanitizer } from '@angular/platform-browser';
declare var JitsiMeetExternalAPI: any;

@Component({
  selector: 'app-jitsi',
  templateUrl: './jitsi.component.html',
  styleUrls: ['./jitsi.component.scss']
})
export class JitsiComponent implements OnInit {
  api: any;
  roomName: String | undefined;
  user: User;
  options: any;
  domain: string | undefined;

  // For Custom Controls
  isAudioMuted = true;
  isVideoMuted = true;
  constructor(
    private router: Router,
    public sanitizer: DomSanitizer
  ) {
    this.domain = 'meet.jit.si';
    this.roomName = 'AndrewPaes';
    this.user = new User(this.roomName, "MR 139");
  }

  async ngOnInit() {
    this.startRoom();
  }

  startRoom(): void {
    let myNode: HTMLElement = <HTMLElement>document.getElementById('jitsi-iframe');
    myNode.innerHTML = '';

    this.options = {
      roomName: this.roomName,
      width: 900,
      height: 500,
      configOverwrite: {
        prejoinPageEnabled: false,
        openBridgeChannel: 'datachannel',
        DISABLE_DOMINANT_SPEAKER_INDICATOR: true
      },
      interfaceConfigOverwrite: {
        // overwrite interface properties
      },
      parentNode: document.querySelector('#jitsi-iframe'),
      userInfo: {
        displayName: this.user.name,
      },
    };

    console.log('nameRoom', this.roomName);
    console.log('prejoinPageEnabled: ', (this.user.name != '' ? true : false));

    this.api = new JitsiMeetExternalAPI(this.domain, this.options);

    this.api.addEventListeners({
      readyToClose: this.handleClose,
      participantLeft: this.handleParticipantLeft,
      participantJoined: this.handleParticipantJoined,
      videoConferenceJoined: this.handleVideoConferenceJoined,
      videoConferenceLeft: this.handleVideoConferenceLeft,
      audioMuteStatusChanged: this.handleMuteStatus,
      videoMuteStatusChanged: this.handleVideoStatus,
      participantRoleChanged: this.participantRoleChanged,
      passwordRequired: this.passwordRequired,
      endpointTextMessageReceived: this.endpointTextMessageReceived,
    });
  }

  changeRouterLink(value: any) {
    console.log(value);
    this.roomName = value;

    let myNode: HTMLElement = <HTMLElement>document.getElementById('jitsi-iframe');
    myNode.innerHTML = '';

    this.api = new JitsiMeetExternalAPI(this.domain, this.options);
  }

  handleClose = () => {
    console.log('handleClose');
  };

  endpointTextMessageReceived = async (event: any) => {
    console.log('mensagem', event, event.data.eventData.text);

    if ((event.data.eventData.text = 'mover a principal')) {
      //this.startRoom('grupo 1', true);
    }
  };

  passwordRequired = async () => {
    console.log('passwordRequired'); // { id: "2baa184e" }
    this.api.executeCommand('password', 'The Password');
  };

  handleParticipantLeft = async (participant: any) => {
    console.log('handleParticipantLeft', participant); // { id: "2baa184e" }
    const data = await this.getParticipants();
  };

  participantRoleChanged = async (participant: any) => {
    console.log('participantRoleChanged', participant);
    //if (participant.role === "moderator")
    {
      console.log('participantRoleChanged:', participant.role);
      this.api.executeCommand('password', 'The Password');
    }
  };

  handleParticipantJoined = async (participant: any) => {
    console.log('OJOJOJOJ  handleParticipantJoined', participant); // { id: "2baa184e", displayName: "Shanu Verma", formattedDisplayName: "Shanu Verma" }

    const data = await this.getParticipants();
  };

  handleVideoConferenceJoined = async (participant: any) => {
    console.log('handleVideoConferenceJoined', participant); // { roomName: "bwb-bfqi-vmh", id: "8c35a951", displayName: "Akash Verma", formattedDisplayName: "Akash Verma (me)"}
    /*
    displayName: "userNameTest"
formattedDisplayName: "userNameTest (me)"
id: "19563d97"
roomName: "PrincipalRoom"
*/

    this.user.setName(participant.userNameTest);
    this.roomName = participant.roomName;

    const data = await this.getParticipants();
  };

  handleVideoConferenceLeft = () => {
    console.log('handleVideoConferenceLeft');
    this.router.navigate(['/thank-you']);
  };

  handleMuteStatus = (audio: any) => {
    console.log('handleMuteStatus', audio); // { muted: true }
  };

  handleVideoStatus = (video: any) => {
    console.log('handleVideoStatus', video); // { muted: true }
  };

  getParticipants() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.api.getParticipantsInfo()); // get all participants
      }, 500);
    });
  }

  // custom events
  executeCommand(command: string) {
    this.api.executeCommand(command); //

    if (command == 'hangup') {
      this.router.navigate(['/thank-you']);
      return;
    }

    if (command == 'toggleAudio') {
      this.isAudioMuted = !this.isAudioMuted;
    }

    if (command == 'toggleVideo') {
      this.isVideoMuted = !this.isVideoMuted;
    }
  }
}
