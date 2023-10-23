import { Component, Input, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { UtilServiceService } from '../../services/util.service.service';

@Component({
  selector: 'app-page-questions',
  templateUrl: './page-questions.component.html',
  styleUrls: ['./page-questions.component.scss'],
})
export class PageQuestionsComponent implements OnInit,OnDestroy {


  // Note : selectedEvidenceId , localImageListKey, school id keys are not there but used in HTML
  @Input() inputIndex :number ;
  start: number = 0;
  @Input() data: any;
  @Input() isLast: boolean;
  @Input() isFirst: boolean;
  @Output() nextCallBack = new EventEmitter();
  @Output() updateLocalData = new EventEmitter();
  @Output() previousCallBack = new EventEmitter()
  @Input() evidenceId: string;
  @Input() hideButton: boolean;
  @Input() submissionId: any;
  @Input() imageLocalCopyId: string;
  @Input() generalQuestion: boolean;
  @Input() schoolId :any;
  @Input() enableQuestionReadOut: boolean;
  notNumber: boolean;
  questionValid: boolean;
  text: string;
  localImageListKey: any;


  selectedEvidenceId: string ='';


  constructor(private utils: UtilServiceService) { }


  ngOnDestroy() {
    console.log(JSON.stringify(this.data))
    for (const question of this.data.pageQuestions) {
      // Do check only for questions without visibleif. For visibleIf questions isCompleted property is set in  checkForVisibility()
      if (!question.visibleIf) {
        question.isCompleted = this.utils.isQuestionComplete(question);
      }
    }
  }

  ngOnInit() {
    this.data.startTime = this.data.startTime ? this.data.startTime : Date.now();
  }

  updateLocalDataInPageQuestion(): void {
    this.updateLocalData.emit();
  }

  checkForVisibility(currentQuestionIndex : number) {
    const currentQuestion = this.data.pageQuestions[currentQuestionIndex];
    let display = true;
    for (const question of this.data.pageQuestions) {
      for (const condition of currentQuestion.visibleIf) {
        if (condition._id === question._id) {
          let expression = [];
          if (condition.operator != "===") {
            if (question.responseType === 'multiselect') {
              for (const parentValue of question.value) {
                for (const value of condition.value) {
                  expression.push("(", "'" + parentValue + "'", "===", "'" + value + "'", ")", condition.operator);
                }
              }
            } else {
              for (const value of condition.value) {
                expression.push("(", "'" + question.value + "'", "===", "'" + value + "'", ")", condition.operator)
              }
            }
            expression.pop();
          } else {
            if (question.responseType === 'multiselect') {
              for (const value of question.value) {
                expression.push("(", "'" + condition.value + "'", "===", "'" + value + "'", ")", "||");
              }
              expression.pop();
            } else {
              expression.push("(", "'" + question.value + "'", condition.operator, "'" + condition.value + "'", ")")
            }
          }
          if (!eval(expression.join(''))) {
            this.data.pageQuestions[currentQuestionIndex].isCompleted = true;
            this.data.pageQuestions[currentQuestionIndex].value = "";
            return false
          } else {
            this.data.pageQuestions[currentQuestionIndex].isCompleted = this.utils.isQuestionComplete(currentQuestion);
          }
        }
      }
    }
    return display
  }


}
