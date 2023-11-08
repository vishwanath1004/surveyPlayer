import { Injectable } from '@angular/core';
import { storageKeys } from '../constants/storageKeys';

@Injectable({
  providedIn: 'root'
})
export class UtilServiceService {

  constructor(
  ) { }

  getAssessmentLocalStorageKey(entityId : string) {
    return "assessmentDetails_" + entityId;
  }
  getCompletedQuestionsCount(questions : any) {
    let count = 0;
    for (const question of questions) {
      if (question.isCompleted) {
        count++;
      }
    }
    return count;
  }
  storeSurvey(submissionId : any, survey : any) {
    let submissionArr =  localStorage.getItem(storageKeys.submissionIdArray);
      if(submissionArr) {
        const x = submissionArr.includes(submissionId);
        if (!x) {
          survey['assessment']['evidences'][0].startTime = Date.now();
          survey['survey'] = true;
          localStorage.setItem(this.getAssessmentLocalStorageKey(submissionId), survey);
          // this.ulsdp.updateSubmissionIdArr(submissionId);
          return survey;
        } else {
          return survey;
        }
      }else{
        survey['assessment']['evidences'][0].startTime = Date.now();
        survey['survey'] = true;
        localStorage.setItem(this.getAssessmentLocalStorageKey(submissionId), survey);
        // this.ulsdp.updateSubmissionIdArr(submissionId);
        return survey;
      };
  }
  isPageQuestionComplete(question : any) {
    for (const element of question.pageQuestions) {
      if (!element.isCompleted) {
        return false;
      }
    }
    return true;
  }

  isQuestionComplete(question: any) {
    if (
      question.validation.required &&
      question.value === "" &&
      question.responseType !== "multiselect" &&
      question.responseType !== 'matrix'
    ) {
      return false;
    }
    if (
      question.validation.required &&
      question.value &&
      !question.value.length &&
      question.responseType === "multiselect"
    ) {
      return false;
    }
    if (
      question.validation.required &&
      question.responseType === 'matrix'
    ) {
      return this.isMatrixQuestionComplete(question);
    }
    if (
      question.validation.regex &&
      (question.responseType === "number" ||
        question.responseType === "text") &&
      !this.testRegex(question.validation.regex, question.value)
    ) {
      return false;
    }
    return true;
  }
  isMatrixQuestionComplete(question : any) {
    if (!question.value.length) {
      return false;
    }
    for (const instance of question.value) {
      for (const question of instance) {
        if (!question.isCompleted) {
          return false;
        }
      }
    }
    return true;
  }

  testRegex(rege :any, value : any): boolean {
    const regex = new RegExp(rege);
    return regex.test(value);
  }

  checkForDependentVisibility(qst : any, allQuestion: any): boolean {
    let display = true;
    for (const question of allQuestion) {
      for (const condition of qst.visibleIf) {
        if (condition._id === question._id) {
          let expression = [];
          if (condition.operator != "===") {
            if (question.responseType === "multiselect") {
              for (const parentValue of question.value) {
                for (const value of condition.value) {
                  expression.push(
                    "(",
                    "'" + parentValue + "'",
                    "===",
                    "'" + value + "'",
                    ")",
                    condition.operator
                  );
                }
              }
            } else {
              for (const value of condition.value) {
                expression.push(
                  "(",
                  "'" + question.value + "'",
                  "===",
                  "'" + value + "'",
                  ")",
                  condition.operator
                );
              }
            }

            expression.pop();
          } else {
            if (question.responseType === "multiselect") {
              for (const value of question.value) {
                expression.push(
                  "(",
                  "'" + condition.value + "'",
                  "===",
                  "'" + value + "'",
                  ")",
                  "||"
                );
              }
              expression.pop();
            } else {
              expression.push(
                "(",
                "'" + question.value + "'",
                condition.operator,
                "'" + condition.value + "'",
                ")"
              );
            }
          }
          if (!eval(expression.join(""))) {
            return false;
          }
        }
      }
    }
    return display;
  }

}
