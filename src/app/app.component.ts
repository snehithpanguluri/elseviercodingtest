import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { IPatinentDetails, PatientDetails } from 'src/Models/PatientDetails';
import { isNullOrUndefined } from 'util';
import { Condition } from 'src/Models/PatientConditions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Health Care';
  public inputPatientNumber: string = '';
  public patientDetails: PatientDetails;
  public conditions: Condition[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  getPatientBasicData() {
    this.patientDetails = null;
    this.conditions = [];

    if (
      !isNullOrUndefined(this.inputPatientNumber) &&
      this.inputPatientNumber.length > 0
    ) {
      this.getPatientDetails(this.inputPatientNumber).subscribe(
        x => {
          this.patientDetails = x;
          if (!isNullOrUndefined(x)) {
            this.getPatientConditionData(this.inputPatientNumber);
            console.log(x);
          }
        },
        error => console.log(error)
      );
    }
  }

  getPatientConditionData(patiendID: string) {
    this.http
      .get('https://r2.smarthealthit.org/Patient/' + patiendID + '/$everything')
      .subscribe(x => {
        for (const iterator of x['entry']) {
          const resource = iterator['resource'];
          if (
            resource['resourceType'] === 'Condition' &&
            resource['clinicalStatus'] === 'active'
          ) {
            const text = resource['code'].text;
            let link = 'https://www.ncbi.nlm.nih.gov/pubmed?term=';
            link = link + text;
            this.conditions.push(
              new Condition(text, resource['onsetDateTime'], encodeURI(link))
            );
          }
        }
        console.log(this.conditions);
      });
  }

  getPatientDetails(patientID: string): Observable<PatientDetails> {
    return this.http
      .get('https://r2.smarthealthit.org/Patient/' + patientID)
      .pipe(
        map(
          x =>
            new PatientDetails(
              x['name'][0]['given'][0],
              x['gender'],
              x['birthDate']
            )
        )
      );
  }

  search(link: string) {
    window.open(link);
  }

  sort(columnName: string, orderBy: string) {
    if (orderBy === 'asc') {
      this.conditions.sort((a, b) => {
        if (a[columnName] < b[columnName]) {
          return -1;
        }
        if (a[columnName] > b[columnName]) {
          return 1;
        }
        return 0;
      });
    } else {
      this.conditions.sort((a, b) => {
        if (a[columnName] > b[columnName]) {
          return -1;
        }
        if (a[columnName] < b[columnName]) {
          return 1;
        }
        return 0;
      });
    }
  }
}
