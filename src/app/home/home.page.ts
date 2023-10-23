import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  isReport: boolean = false;
  surveyList =[
  {
      "solutionId": "6026a340262f8023e11072b0",
      "status": "completed",
      "submissionId": "62317e40c7fe210007b69bd8",
      "name": "Survey of Diksha awareness - Test",
      "description": "The survey is to understand if parents have been able to enroll child into diksha courses and the challenges if not.",
      "_id": "62317e40c7fe210007b69bd1",
      "endDate": "2022-12-24T00:00:00.000Z",
      "isCreator": false,
      "generatedExpMsg": "Expired On 24th Dec 22"
  },
  {
      "solutionId": "627dfc6509446e00072ccf78",
      "status": "completed",
      "submissionId": "62e228eedd8c6d0009da5084",
      "name": "Create a Survey (To check collated reports) for 4.9 regression -- FD 380",
      "description": "Create a Survey (To check collated reports) for 4.9 regression -- FD 380",
      "_id": "62e228eedd8c6d0009da507d",
      "endDate": "2022-12-24T00:00:00.000Z",
      "isCreator": false,
      "generatedExpMsg": "Expired On 24th Dec 22"
  },
  {
      "solutionId": "648c1e305c81330008b68dad",
      "status": "completed",
      "submissionId": "6493d5ca5c81330008b72918",
      "name": "ಸಮೀಕ್ಷೆ ಟೆಂಪ್ಲೇಟ್-ಕೆಟ",
      "description": "This is a survey for school performance",
      "_id": "6493d5ca5c81330008b7290f",
      "endDate": "2023-08-30T23:59:59.000Z",
      "isCreator": false,
      "generatedExpMsg": "Expired On 31st Aug 23"
  },
  {
      "solutionId": "649ab5145c81330008b7c1d8",
      "status": "started",
      "submissionId": "649ab5d35c81330008b7c208",
      "name": "Survey HT",
      "description": "This is a survey for school performance",
      "_id": "649ab5d35c81330008b7c1ff",
      "endDate": "2025-01-02T18:30:00.000Z",
      "isCreator": false,
      "generatedExpMsg": "Valid till 3rd Jan 25"
  },
  {
      "solutionId": "6499311e5c81330008b78395",
      "status": "completed",
      "submissionId": "649ab6b85c81330008b7c23e",
      "name": "Survey Template-KT",
      "description": "This is a survey for school performance",
      "_id": "649ab6b85c81330008b7c235",
      "endDate": "2023-08-30T23:59:59.000Z",
      "isCreator": false,
      "generatedExpMsg": "Expired On 31st Aug 23"
  },
  {
      "solutionId": "62b1c27b76ca3c000796a980",
      "status": "completed",
      "submissionId": "62e23968dd8c6d0009da5205",
      "name": "Survey FD-444 expiry - 31/07/2022",
      "description": "The survey is to understand if parents have been able to enroll child into diksha courses and the challenges if not.",
      "_id": "62e23968dd8c6d0009da51fe",
      "endDate": "2022-12-09T23:59:44.547Z",
      "isCreator": false,
      "generatedExpMsg": "Expired On 10th Dec 22"
  },
  {
      "solutionId": "63b2cca2a6e88e000811776c",
      "status": "completed",
      "submissionId": "63b52bb42be0b800093ab0e5",
      "name": "Test survey regration 5.1 879",
      "description": "Test survey regration 5.1 879",
      "_id": "63b52bb22be0b800093ab0d7",
      "endDate": "2023-09-14T23:59:59.000Z",
      "isCreator": false,
      "generatedExpMsg": "Expired On 15th Sep 23"
  },
  {
      "solutionId": "64ad2859c60fd10008693458",
      "status": "completed",
      "submissionId": "6503bdc7297c610008daa70f",
      "name": "Survey_NOC_Test",
      "description": "This is a survey for school performance",
      "_id": "6503bdc6297c610008daa706",
      "endDate": "2023-12-04T23:59:59.000Z",
      "isCreator": false,
      "generatedExpMsg": "Valid till 5th Dec 23"
  },
  {
      "solutionId": "640f0af32be0b800093b9a42",
      "status": "completed",
      "submissionId": "6503bf4d297c610008daa7a1",
      "name": "Survey expiry date 07/05/2024",
      "description": "Test survey regration 5.1 879",
      "_id": "6503bf4d297c610008daa799",
      "endDate": "2024-05-07T00:00:00.000Z",
      "isCreator": false,
      "generatedExpMsg": "Valid till 7th May 24"
  },
  {
      "solutionId": "6502fa94297c610008daa5f8",
      "status": "completed",
      "submissionId": "650a7ff8e5b0cb000868c48f",
      "name": "Survey expiry in 2 days",
      "description": "This is a survey for school performance",
      "_id": "650a7ff8e5b0cb000868c486",
      "endDate": "2023-09-21T18:29:00.000Z",
      "isCreator": false,
      "generatedExpMsg": "Expired On 21st Sep 23"
  }
]
  constructor(private router : Router) {}
  onSurveyClick(survey : any){
    this.router.navigate(['home/details'],{
      queryParams: {
        submisssionId: survey.submissionId,
        evidenceIndex: 0,
        sectionIndex: 0,
        isSurvey:true
      },
    });
  }

  setStatusColor(status : any) {
    switch (status) {
      case 'started':
        return 'orange';
        break;
      case 'completed':
        return 'lightgreen';
        break;
      case 'expired':
        return 'grey';
        break;

      default:
        break;
    }
  }
}
