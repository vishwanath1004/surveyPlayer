import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { UtilServiceService } from '../shared/services/util.service.service';
import {details} from "../shared/mockdata/survey-details";
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-survey-details',
  templateUrl: './survey-details.component.html',
  styleUrls: ['./survey-details.component.scss'],
})
export class SurveyDetailsComponent  implements OnInit {
  extrasState:any;
  questions: any[]=[];
  schoolName: string ='';
  submissionId: any;
  selectedEvidenceIndex: any = 0;
  selectedSectionIndex: any = 0;
  start: number = 0;
  end: number = 1;
  schoolData: any;
  isLast: boolean = false;
  isFirst: boolean =false;
  selectedEvidenceId: string ='';
  isCurrentEvidenceSubmitted: any;
  allQuestionsOfEvidence: Array<any> = [];
  isViewOnly: boolean = false;
  dashbordData: any;
  modalRefrnc: any;
  localImageListKey: any;
  countCompletedQuestion: number = 0;
  captureGpsLocationAtQuestionLevel: boolean = false;
  enableQuestionReadOut: boolean = false;
  networkAvailable = true;
  isTargeted :boolean = false;;
  isSurvey : boolean = false;
  schoolId:any;
  constructor(
    // private localStorage : Storage,
    private utils : UtilServiceService,
    private routerParam : ActivatedRoute,
    private router : Router,
    private translate :TranslateService,
    private  location : Location,
    public actionSheetCtrl: ActionSheetController,

  ) { 
    this.routerParam.queryParams.subscribe((params:any) => {
      this.submissionId = params.submisssionId;
      this.selectedEvidenceIndex = params.evidenceIndex ? parseInt(params.evidenceIndex): 0;
      this.selectedSectionIndex = params.sectionIndex ? parseInt(params.sectionIndex): 0;
      this.schoolName = params.schoolName;
      this.isSurvey = params.isSurvey == 'true';
    });
    // State is using for Template view for Deeplink.
    this.extrasState = this.router.getCurrentNavigation()!.extras.state;
    if(this.extrasState){
      this.isTargeted = this.extrasState.isATargetedSolution;
    }
  }

  ngOnInit() {
    // this.getQuestions(details);
    if(this.extrasState){
      this.isViewOnly = true;
      this.getQuestions(this.extrasState);
    }else{
     let data:any = localStorage.getItem(this.utils.getAssessmentLocalStorageKey(this.submissionId));
    data ? this.getQuestions(JSON.parse(data)) :  this.getQuestions(details);
    }
  }

  getQuestions(data : any){
    this.schoolData = data;
    const currentEvidences = this.schoolData['assessment']['evidences'];
    this.enableQuestionReadOut = this.schoolData['solution']['enableQuestionReadOut'];
    this.captureGpsLocationAtQuestionLevel = this.schoolData['solution']['captureGpsLocationAtQuestionLevel'];
    this.countCompletedQuestion = this.utils.getCompletedQuestionsCount(
      this.schoolData['assessment']['evidences'][this.selectedEvidenceIndex]['sections'][this.selectedSectionIndex][
        'questions'
      ]
    );

    this.selectedEvidenceId = currentEvidences[this.selectedEvidenceIndex].externalId;
    this.localImageListKey = 'images_' + this.selectedEvidenceId + '_' + this.submissionId;
    this.isViewOnly = !this.isSurvey && !currentEvidences[this.selectedEvidenceIndex]['startTime'] ? true : false;
    this.questions =
      currentEvidences[this.selectedEvidenceIndex]['sections'][this.selectedSectionIndex]['questions'];
    this.schoolData['assessment']['evidences'][this.selectedEvidenceIndex]['sections'][
      this.selectedSectionIndex
    ].totalQuestions = this.questions.length;
    this.dashbordData = {
      questions: this.questions,
      evidenceMethod: currentEvidences[this.selectedEvidenceIndex]['name'],
      sectionName: currentEvidences[this.selectedEvidenceIndex]['sections'][this.selectedSectionIndex].name,
      currentViewIndex: this.start,
    };
    this.isCurrentEvidenceSubmitted = currentEvidences[this.selectedEvidenceIndex].isSubmitted;
    if (!this.isSurvey && this.isCurrentEvidenceSubmitted || this.isViewOnly) {
        // document.getElementById('stop')!.style!.pointerEvents = 'none';
    }
  }
  checkForEvidenceCompletion(): boolean {
    let allAnswered;
    let evidenceSections = this.schoolData['assessment']['evidences'][this.selectedEvidenceIndex]['sections']
     let currentEvidence = this.schoolData['assessment']['evidences'][this.selectedEvidenceIndex];
    for (const section of evidenceSections) {
      allAnswered = true;
      for (const question of section.questions) {
        if (!question.isCompleted) {
          allAnswered = false;
          break;
        }
      }
      if (currentEvidence.isSubmitted) {
        section.progressStatus = 'submitted';
      } else if (!currentEvidence.startTime) {
        section.progressStatus = '';
      } else if (allAnswered) {
        section.progressStatus = 'completed';
      } else if (!allAnswered && section.progressStatus) {
        section.progressStatus = 'inProgress';
      } else if (!section.progressStatus) {
        section.progressStatus = '';
      }
    }
    let allAnsweredForEvidence = true;
    for (const section of evidenceSections) {
      if (section.progressStatus !== 'completed') {
        allAnsweredForEvidence = false;
        break;
      }
    }
    return allAnsweredForEvidence
  }
  updateLocalData(){

  }

  next(status?: string) {
    if (this.questions[this.start].responseType === 'pageQuestions') {
      this.questions[this.start].endTime = this.questions[this.start] ? Date.now() : '';
      this.questions[this.start].isCompleted = this.utils.isPageQuestionComplete(this.questions[this.start]);
    }
    if (this.questions[this.start].children.length) {
      this.updateTheChildrenQuestions(this.questions[this.start]);
    }
    if (this.end < this.questions.length && !status) {
      if (this.submissionId) {
       localStorage.setItem(this.utils.getAssessmentLocalStorageKey(this.submissionId), this.schoolData);
      }
      this.start++;
      this.end++;
      this.dashbordData.currentViewIndex = this.start;
      if (
        this.questions[this.start].visibleIf.length &&
        this.questions[this.start].visibleIf[0] &&
        !this.checkForQuestionDisplay(this.questions[this.start])
      ) {
        this.questions[this.start].isCompleted = true;
        this.next();
      } else if (
        this.questions[this.start].visibleIf.length &&
        this.questions[this.start].visibleIf[0] &&
        this.checkForQuestionDisplay(this.questions[this.start])
      ) {
      }
    } else if (status === 'completed' && this.submissionId) {
      this.schoolData['assessment']['evidences'][this.selectedEvidenceIndex].sections[
        this.selectedSectionIndex
      ].progressStatus = this.getSectionStatus();
      let respData = JSON.stringify(this.schoolData);
        localStorage.setItem(this.utils.getAssessmentLocalStorageKey(this.submissionId), respData)
         this.location.back();
    } else {
      this.next('completed');
    }
    this.updateCompletedQuestionCount();
  }

  checkForQuestionDisplay(qst :any): boolean {
    return this.utils.checkForDependentVisibility(qst, this.questions);
  }

  updateCompletedQuestionCount() {
    this.schoolData['assessment']['evidences'][this.selectedEvidenceIndex]['sections'][
      this.selectedSectionIndex
    ].completedQuestions = this.utils.getCompletedQuestionsCount(
      this.schoolData['assessment']['evidences'][this.selectedEvidenceIndex]['sections'][this.selectedSectionIndex][
        'questions'
      ]
    );
    this.countCompletedQuestion = this.utils.getCompletedQuestionsCount(
      this.schoolData['assessment']['evidences'][this.selectedEvidenceIndex]['sections'][this.selectedSectionIndex][
        'questions'
      ]
    );
  }

  updateTheChildrenQuestions(parentQuestion : any) {
    for (const child of parentQuestion.children) {
      for (const question of this.questions) {
        if (
          child === question._id &&
          eval(
            '"' + parentQuestion.value + '"' + question.visibleIf[0].operator + '"' + question.visibleIf[0].value + '"'
          ) &&
          !question.value
        ) {
          question.isCompleted = false;
        } else if (child === question._id && parentQuestion.value !== question.visibleIf[0].value) {
          question.isCompleted = true;
        }
      }
    }
  }

  getSectionStatus(): string {
    let allAnswered = true;
    let currentEcm = this.schoolData['assessment']['evidences'][this.selectedEvidenceIndex];
    let currentSection = this.schoolData['assessment']['evidences'][this.selectedEvidenceIndex].sections[
      this.selectedSectionIndex
    ];
    for (const question of currentSection.questions) {
      if (!question.isCompleted) {
        allAnswered = false;
        break;
      }
    }
    if (currentEcm.isSubmitted) {
      currentSection.progressStatus = 'submitted';
    } else if (!currentEcm.startTime) {
      currentSection.progressStatus = '';
    } else if (allAnswered) {
      currentSection.progressStatus = 'completed';
    } else if (!allAnswered && currentSection.progressStatus) {
      currentSection.progressStatus = 'inProgress';
    } else if (!currentSection.progressStatus) {
      currentSection.progressStatus = '';
    }
    return currentSection.progressStatus;
  }
}
