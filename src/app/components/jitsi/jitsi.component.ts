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
  possible = "1234567890";
  lengthOfCode = 40;

  // For Custom Controls
  isAudioMuted = true;
  isVideoMuted = true;
  constructor(
    private router: Router,
    public sanitizer: DomSanitizer
  ) {
    this.domain = 'localhost:8443';
    this.roomName = 'SalaTeste';

    let name = this.makeRandom(this.lengthOfCode, this.possible);
    this.user = new User(this.roomName, "MR " + name);
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
      readyToClose: this.readyToCloseEvent,
      participantLeft: this.participantLeftEvent,
      participantJoined: this.participantJoinedEvent,
      videoConferenceJoined: this.videoConferenceJoinedEvent,
      videoConferenceLeft: this.videoConferenceLeftEvent,
      audioMuteStatusChanged: this.audioMuteStatusChangedEvent,
      videoMuteStatusChanged: this.videoMuteStatusChangedEvent,
      participantRoleChanged: this.participantRoleChangedEvent,
      passwordRequired: this.passwordRequiredEvent,
      endpointTextMessageReceived: this.endpointTextMessageReceivedEvent,
    });
  }

  // Events

  readyToCloseEvent = () => {
    console.log('handleClose');
  };

  participantLeftEvent = async (participant: any) => {
    console.log('handleParticipantLeft', participant); // { id: "2baa184e" }
    const data = await this.getParticipants();
  };

  participantJoinedEvent = async (participant: any) => {
    console.log('OJOJOJOJ  handleParticipantJoined', participant); // { id: "2baa184e", displayName: "Shanu Verma", formattedDisplayName: "Shanu Verma" }

    const data = await this.getParticipants();
  };

  videoConferenceJoinedEvent = async (participant: any) => {
    console.log('handleVideoConferenceJoined', participant); // { roomName: "bwb-bfqi-vmh", id: "8c35a951", displayName: "Akash Verma", formattedDisplayName: "Akash Verma (me)"}

    this.user.setName(participant.userNameTest);
    this.roomName = participant.roomName;

    const data = await this.getParticipants();
  };

  videoConferenceLeftEvent = () => {
    console.log('handleVideoConferenceLeft');
    this.router.navigate(['/thank-you']);
  };

  audioMuteStatusChangedEvent = (audio: any) => {
    console.log('handleMuteStatus', audio); // { muted: true }
  };

  videoMuteStatusChangedEvent = (video: any) => {
    console.log('handleVideoStatus', video); // { muted: true }
  };

  participantRoleChangedEvent = async (participant: any) => {
    console.log('participantRoleChanged', participant);

    if (participant.role === "moderator") {
      console.log('participantRoleChanged:', participant.role);
      this.api.executeCommand('password', 'The Password');
    }
  };

  passwordRequiredEvent = async () => {
    console.log('passwordRequired'); // { id: "2baa184e" }
    this.api.executeCommand('password', 'The Password');
  };

  endpointTextMessageReceivedEvent = async (event: any) => {
    console.log('mensagem', event, event.data.eventData.text);

    if ((event.data.eventData.text = 'mover a principal')) {
      //this.startRoom('grupo 1', true);
    }
  };

  // Functions

  functions() {
    // Captures a screenshot for the participant in the large video view (on stage).
    this.api.captureLargeVideoScreenshot().then((data: any) => {
      // data is an Object with only one param, dataURL
      // data.dataURL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABQAA..."
    });

    // Retrieves a list of available devices.
    this.api.getAvailableDevices().then((devices: any) => {
      // devices = {
      //     audioInput: [{
      //         deviceId: 'ID'
      //         groupId: 'grpID'
      //         kind: 'audioinput'
      //         label: 'label'
      //     },....],
      //     audioOutput: [{
      //         deviceId: 'ID'
      //         groupId: 'grpID'
      //         kind: 'audioOutput'
      //         label: 'label'
      //     },....],
      //     videoInput: [{
      //         deviceId: 'ID'
      //         groupId: 'grpID'
      //         kind: 'videoInput'
      //         label: 'label'
      //     },....]
      // }
    });

    // Returns a promise which resolves with an array of currently sharing participants ID's.
    this.api.getContentSharingParticipants().then((res: any) => {
      //res.sharingParticipantIds = [particId1, particId2, ...]
    });

    // Retrieves a list of currently selected devices.
    this.api.getCurrentDevices().then((devices: any) => {
      // devices = {
      //     audioInput: {
      //         deviceId: 'ID'
      //         groupId: 'grpID'
      //         kind: 'videoInput'
      //         label: 'label'
      //     },
      //     audioOutput: {
      //         deviceId: 'ID'
      //         groupId: 'grpID'
      //         kind: 'videoInput'
      //         label: 'label'
      //     },
      //     videoInput: {
      //         deviceId: 'ID'
      //         groupId: 'grpID'
      //         kind: 'videoInput'
      //         label: 'label'
      //     }
      // }
    });

    // Retrieves an object containing information about the deployment.
    this.api.getDeploymentInfo().then((deploymentInfo: any) => {
      // deploymentInfo = {
      //     region: 'deployment-region',
      //     shard: 'deployment-shard',
      //     ...
      // }
    });

    // Retrieves an object containing information about livestreamUrl of the current live stream.
    this.api.getLivestreamUrl().then((livestreamData: any) => {
      // livestreamData = {
      //     livestreamUrl: 'livestreamUrl'
      // }
    });

    // Returns an array of available rooms and details of it:
    // isMainRoom (true,false), id, jid
    // participants: Participant[]
    //          id
    //          jid
    //          role
    //          displayName
    this.api.getRoomsInfo().then((rooms: any) => {
      // see response example structure
    });

    // Returns the current video quality setting.
    this.api.getVideoQuality();

    // Resolves to true if the device change is available and to false if not.
    // The accepted deviceType values are - 'output', 'input' or undefined.
    this.api.isDeviceChangeAvailable("output").then((isDeviceChangeAvailable: any) => {

    });

    // Resolves to true if the device list is available and to false if not.
    this.api.isDeviceListAvailable().then((isDeviceListAvailable: any) => {

    });

    // Resolves to true if multiple audio input is supported and to false if not.
    this.api.isMultipleAudioInputSupported().then((isMultipleAudioInputSupported: any) => {

    });

    // Selects the participant ID to be the pinned participant in order to always receive video for this participant.
    // The second parameter is optional and can be used to specify a videoType.
    // When multistream support is enabled by passing this parameter you can specify whether the desktop or the camera video for the specified participant should be pinned.
    // The accepted values are 'camera' and 'desktop'.
    // The default is 'camera'.
    // Any invalid values will be ignored and default will be used.
    this.api.pinParticipant("participantId", "videoType");

    // Resizes the large video container per the provided dimensions.
    this.api.resizeLargeVideo("width", "height");

    // Sets the audio input device to the one with the passed label or ID.
    this.api.setAudioInputDevice("deviceLabel", "deviceId");

    // Sets the audio output device to the one with the passed label or ID.
    this.api.setAudioOutputDevice("deviceLabel", "deviceId");

    // Displays the participant with the given participant ID on the large video.
    // If no participant ID is given, a participant is picked based on the dominant, pinned speaker settings.
    this.api.setLargeVideoParticipant("participantId");

    // Sets the video input device to the one with the passed label or ID.
    this.api.setVideoInputDevice("deviceLabel", "deviceId");

    // Starts a file recording or streaming session. See the startRecording command for more details.
    this.api.startRecording("options");

    // Stops an ongoing file recording or streaming session. See the stopRecording command for more details.
    this.api.stopRecording("mode");

    // Returns the number of conference participants:
    const numberOfParticipants = this.api.getNumberOfParticipants();

    // Returns a participant's display name:
    const displayName = this.api.getDisplayName("participantId");

    // Returns a participant's email:
    const email = this.api.getEmail("participantId");

    // Returns the IFrame HTML element which is used to load the Jitsi Meet conference:
    const iframe = this.api.getIFrame();

    // Returns a Promise which resolves to the current audio disabled state:
    this.api.isAudioDisabled().then((disabled: any) => {

    });

    // Returns a Promise which resolves to the current audio muted state:
    this.api.isAudioMuted().then((muted: any) => {

    });

    // Returns a Promise which resolves to the current video muted state:
    this.api.isVideoMuted().then((muted: any) => {

    });

    // Returns a Promise which resolves to the current audio availability state:
    this.api.isAudioAvailable().then((available: any) => {

    });

    // Returns a Promise which resolves to the current video availability state:
    this.api.isVideoAvailable().then((available: any) => {

    });

    // Returns a Promise which resolves to the current moderation state of the given media type.
    // mediaType can be either audio (default) or video.
    this.api.isModerationOn("mediaType").then((isModerationOn: any) => {

    });

    // Returns a Promise which resolves to a Boolean or null, when there is no conference.
    this.api.isP2pActive().then((isP2p: any) => {

    });

    // Returns a Promise which resolves to the current force mute state of the given participant for the given media type.
    // mediaType can be either audio (default) or video.
    // Force muted - moderation is on and participant is not allowed to unmute the given media type.
    this.api.isParticipantForceMuted("participantId", "mediaType").then((isForceMuted: any) => {

    });

    // Returns a Promise which resolves with the current participants pane state.
    this.api.isParticipantsPaneOpen().then((state: any) => {

    });

    // Returns a Promise which resolves with whether meeting was started in view only.
    this.api.isStartSilent().then((startSilent: any) => {

    });

    // Returns a Promise which resolves with the map of breakout rooms.
    // NOTE: The invitee format in the array depends on the invite service used in the deployment.
    // PSTN invite objects have the following structure:
    // {
    //     type: 'phone',
    //     number: <string> // the phone number in E.164 format  (ex. +31201234567)
    // }
    // SIP invite objects have the following structure:
    // {
    //     type: 'sip',
    //     address: <string> // the sip address
    // }
    this.api.listBreakoutRooms().then((breakoutRooms: any) => {

    });

    // Invite the given array of participants to the meeting:
    this.api.invite([{ "...": "" }, { "...": "" }, { "...": "" }]).then(() => {
      // success
    }).catch(() => {
      // failure
    });

    // Removes the embedded Jitsi Meet conference:
    this.api.dispose();
  }

  // Commands






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


  // Utils

  makeRandom(lengthOfCode: number, possible: string): string {
    let text = "";
    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  changeRouterLink(value: any) {
    console.log(value);
    this.roomName = value;

    let myNode: HTMLElement = <HTMLElement>document.getElementById('jitsi-iframe');
    myNode.innerHTML = '';

    this.api = new JitsiMeetExternalAPI(this.domain, this.options);
  }
}
