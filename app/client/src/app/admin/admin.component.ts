import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { PatientService } from '../patient/patient.service';
import { DisplayVal, PatientAdminViewRecord, PatientViewRecord } from '../patient/patient';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  public adminId: any;
  public patientRecords$?: Observable<Array<PatientAdminViewRecord>>;
  private sub?: Subscription;
  public headerNames = [
    new DisplayVal(PatientViewRecord.prototype.patientId, 'Id Patient'),
    new DisplayVal(PatientViewRecord.prototype.firstName, 'Prénom'),
    new DisplayVal(PatientViewRecord.prototype.lastName, 'Nom')
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly patientService: PatientService
  ) { }

  ngOnInit(): void {
    this.sub = this.route.params
      .subscribe((params: Params) => {
        this.adminId = params.adminId;
        this.refresh();
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  public refresh(): void {
    this.patientRecords$ = this.patientService.fetchAllPatients();
  }
}
