import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JaasService } from '../../services/jaas.service';

@Component({
  selector: 'app-jaas',
  templateUrl: './jaas.component.html',
  styleUrls: ['./jaas.component.scss']
})
export class JaasComponent implements OnInit {
  constructor(
    private router: Router,
    private jitsiService: JaasService
  ) { }

  async ngOnInit() {

  }
}
