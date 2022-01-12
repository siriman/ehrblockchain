import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { PatientService } from '../patient.service';
import { DisplayVal, PatientViewRecord } from '../patient';
import { RoleEnum } from '../../utils';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-patient-history',
  templateUrl: './patient-history.component.html',
  styleUrls: ['./patient-history.component.scss']
})
export class PatientHistoryComponent implements OnInit, OnDestroy {
  public patientID: any;
  public patientRecordHistoryObs$?: Observable<Array<PatientViewRecord>>;
  public data: any;
  private sub?: Subscription;
  headerNames = [
    new DisplayVal(PatientViewRecord.prototype.Timestamp, 'Date'),
    new DisplayVal(PatientViewRecord.prototype.changedBy, 'Dernière modification par'),
    new DisplayVal(PatientViewRecord.prototype.firstName, 'Prenom'),
    new DisplayVal(PatientViewRecord.prototype.lastName, 'Nom'),
    new DisplayVal(PatientViewRecord.prototype.age, 'Age'),
    new DisplayVal(PatientViewRecord.prototype.bloodGroup, 'Groupe Sanguin'),
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly patientService: PatientService,
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    if (this.isPatient()) {
      this.headerNames.push(
        new DisplayVal(PatientViewRecord.prototype.address, 'Adresse'),
        new DisplayVal(PatientViewRecord.prototype.phoneNumber, 'Contact'),
        new DisplayVal(PatientViewRecord.prototype.emergPhoneNumber, 'Numéro d\'urgence')
      );
    }
    this.headerNames.push(
      new DisplayVal(PatientViewRecord.prototype.allergies, 'Allergies'),
      new DisplayVal(PatientViewRecord.prototype.diagnosis, 'Diagnostics'),
      new DisplayVal(PatientViewRecord.prototype.symptoms, 'Symptomes'),
      new DisplayVal(PatientViewRecord.prototype.treatment, 'Traitement'),
      new DisplayVal(PatientViewRecord.prototype.followUp, 'Durée du suivi')
    );
    this.sub = this.route.params
      .subscribe((params: Params) => {
        this.patientID = params.patientId;
        this.refresh();
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  public refresh(): void {
    this.patientRecordHistoryObs$ = this.patientService.getPatientHistoryByKey(this.patientID);
  }

  public isPatient(): boolean {
    return this.authService.getRole() === RoleEnum.PATIENT;
  }

  public convertToDate(val: any): string{
    return new Date(val.seconds.low * 1000).toDateString();
  }
}
