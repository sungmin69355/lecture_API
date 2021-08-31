const express = require('express'),
      router = express.Router();
const lecture_apply = require('../API/controllers/lecture_apply.controller'),
      lecture_list = require('../API/controllers/lecture_list.controller'),
      user = require('../API/controllers/user.controller'),
      enrollment = require('../API/controllers/lecture_enrollment.controller'),
      lecture_related = require('../API/controllers/lecture_related.controller');
const user_validate = require('../API/validation/user'),
      apply_validate = require('../API/validation/lecture_apply'),
      list_validate = require('../API/validation/lecture_list'),
      lecture_enrollment_validation = require('../API/validation/lecture_enrollment'),
      lecture_related_validation = require('../API/validation/lecture_related');

//학생 수강신청
router.post('/lecture-apply',apply_validate.apply_validation, lecture_apply.lecture_apply);

//강의 목록 조회
router.get('/lecture-list',list_validate.list_validation, lecture_list.lecture_list);

//회원가입
router.post('/signup', user_validate.user_singup, user.signup);

//강사 강의 등록 
router.post('/lecture-enrollment',lecture_enrollment_validation.enrollment_validation, enrollment.lecture_enrollment);

//강의 삭제
router.delete('/lecture-delete',lecture_related_validation.lecture_delete, lecture_related.lecture_delete);

//강의 오픈
router.post('/lecture-open', lecture_related_validation.lecture_open, lecture_related.lecture_open);

//강의 수정
router.post('/lecture-edit',lecture_related_validation.lecture_edit, lecture_related.lecture_edit);

//강의 상세 조회
router.get('/lecture-details',lecture_related_validation.lecture_details, lecture_related.lecture_details);

module.exports = router;