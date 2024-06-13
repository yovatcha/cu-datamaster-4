// form
import { useFieldArray, useFormContext } from 'react-hook-form';
// @mui
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    Divider,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import Swal from 'sweetalert2';

// utils
import { isEmpty } from 'lodash';
// components
import Iconify from '../../../../Iconify';

import { LoadingButton } from '@mui/lab';
import FormControlLabel from '@mui/material/FormControlLabel';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import axios from '../../../../../utils/axios';
//hook
import { serialize } from 'object-to-formdata';
import { useDispatch, useSelector } from '../../../../../redux/store';
import { COUNTRY } from '../../Data/country';
import { MASTERS_ACADEMICEN, MASTERS_ACADEMICTH, MASTERS_COURSE, MASTERS_NAMETITLESEN, MASTERS_NAMETITLESTH, MASTERS_SEMESTER, MASTERS_STATUS, MASTERS_STUDYPLAN, MASTERS_STUDYQE } from '../../Data/datamasters';
import DataMastersPageFive from './DataMastersPageFive';
import DataMastersPageFour from './DataMastersPageFour';
import DataMastersPageThree from './DataMastersPageThree';
import DataMastersPageTwo from './DataMastersPageTwo';

import {
    setRenderPage
} from '../../../../../redux/slices/workloadRender';
// ----------------------------------------------------------------------

const SERVICE_OPTIONS = [
  'full stack development',
  'backend development',
  'ui design',
  'ui/ux design',
  'front end development',
];
const EDUCATION_LEVEL = ['Ph.D', 'Master', 'Bec'];
const EDUCATION_YEAR = ['2560', '2561', '2562', '2563', '2564', '2565'];
const TOPIC_OPTIONS = ['1', '2', '3'];
const SUBJECT_OPTIONS = ['MATH', 'SCI', 'COM', 'อื่น ๆ'];
const MASTERS_MAJOR = [
  { label: 'เภสัชศาสตร์ Pharmaceutical Sciences', value: '1' },
  { label: 'การบริบาลทางเภสัชกรรม Pharmaceutical Care', value: '2' },
  { label: 'เภสัชกรรมอุตสาหการ Master of Science Industrial Pharmacy', value: '3' },
  { label: 'เภสัชกรรมอุตสาหการ(นอกเวลา) Master of Science  Industrial Pharmacy', value: '4' },
  { label: 'เภสัชกรรมอุตสาหการ Doctor of Philosophy Industrial Pharmacy', value: '5' },
  { label: 'การบริบาลทางเภสัชกรรม Master of Science Pharmaceutical Care', value: '6' },
  { label: 'การบริบาลทางเภสัชกรรม Doctor of Philosophy Pharmaceutical Care', value: '7' },
  {
    label:
      'เภสัชศาสตร์สังคมและบริหาร(หลักสูตรนานาชาติ) Master of Science Social and Administrative Pharmacy (International Program)',
    value: '8',
  },
  {
    label:
      'เภสัชศาสตร์สังคมและบริหาร (หลักสูตรนานาชาติ) Doctor of Philosophy Social and Administrative Pharmacy (International Program)',
    value: '9',
  },
  { label: 'เภสัชวิทยาและพิษวิทยา Master of Science Pharmacology and Toxicology', value: '10' },
  { label: 'เภสัชวิทยาและพิษวิทยา Doctor of Philosophy Pharmacology and Toxicology', value: '11' },
  { label: 'เภสัชศาสตร์และเทคโนโลยี Master of Science Pharmaceutical Sciences and Technology', value: '12' },
  { label: 'เภสัชศาสตร์และเทคโนโลยี Doctor of Philosophy Pharmaceutical Sciences and Technology', value: '13' },
  { label: 'วิทยาศาสตร์เครื่องสำอาง (นอกเวลา) Master of Science Cosmetic Science', value: '14' },
];

const steps = ['General Information', 'Education', 'Address'];

const nationalityOptions = [{ label: 'คนไทย' }, { label: 'ต่างชาติ' }];
const teacherOptions = [{ label: 'อาจารย์ภายในคณะ' }, { label: 'อาจารย์นอกคณะ' }];
const co_advisorOptions = [
  { label: 'อาจารย์ภายในคณะ', value: '1' },
  { label: 'อาจารย์นอกคณะ', value: '2' },
];
const semesterOptions = [
  { label: 'ต้น', value: '1' },
  { label: 'ปลาย', value: '2' },
];

// DatapageTwo
const resolutionOptions1 = [{ label: 'มติเวียน' }, { label: 'มติประชุม' }];
const resolutionOptions2 = [{ label: 'มติเวียน' }, { label: 'มติประชุม' }];

// DatapageThree
const positionOptions = [{ label: 'Online' }, { label: 'Offline' }];

function removeNullAndEmptyDeep(obj) {
  if (Array.isArray(obj)) {
    return obj.map((item) => removeNullAndEmptyDeep(item)).filter((item) => item !== null && item !== '');
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.keys(obj).reduce((newObj, key) => {
      newObj[key] = removeNullAndEmptyDeep(obj[key]);
      return newObj;
    }, {});
  } else {
    return obj;
  }
}

export default function WorkloadPageOne({
  isFetchApi,
  handleSetCourseForFill,
  courseForFill,
  id,
  handleChangeWorkloadClear,
}) {
  const { control, setValue, watch } = useFormContext();
  const [isDisable, setIsDisable] = useState(true);
  const dispatch = useDispatch();

  const { renderPage, yearSelected, isLoading, editDataForFill, typeSubmit, courseData, dataForEdit } = useSelector(
    (state) => state.workloadRender
  );
  const [isFetch, setIsFetch] = useState(false);
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });
  const [loadingSend, setLoadingSend] = useState(false);
  const [lecturer, setLecturer] = useState(null);
  const [lecturerNumber, setLecturerNumber] = useState(null);
  const [lecturerNames, setLecturerNames] = useState(null);

  const [student, setStudent] = useState(null);
  const [studentNames, setStudentNames] = useState(null);

  // Data setting
  const [editMode, setEditMode] = useState(false);
  const [selectedMasterStatus, setSelectedMasterStatus] = useState(null);
  const [selectedMasterNamePrefixTh, setSelectedMasterNamePrefixTh] = useState(null);
  const [selectedMasterMajor, setSelectedMasterMajor] = useState(null);
  const [selectedDegree, setSelectedDegree] = useState(null);
  const [selectedMasterNamePrefixEn, setSelectedMasterNamePrefixEn] = useState(null);
  const [selectedMasterCountry, setSelectedMasterCountry] = useState(null);
  const [selectedMasterStudyPlan, setSelectedMasterStudyPlan] = useState(null);
  const [selectedMasterSemester, setSelectedMasterSemester] = useState(null);
  const [selectedMasterUniversityCountry, setSelectedMasterUniversityCountry] = useState(null);
  const [selectedBachelorUniversityCountry, setSelectedBachelorUniversityCountry] = useState(null);
  const [selectedAcademicRanksAdviserTh, setSelectedAcademicRanksAdviserTh] = useState(null);
  const [selectedAcademicRanksAdviserEn, setSelectedAcademicRanksAdviserEn] = useState(null);
  const [selectedStudyPlansAdvisorQe, setSelectedStudyPlansAdvisorQe] = useState(null);
  const [selectedSubject1, setSelectedSubject1] = useState(null);
  const [selectedSubject2, setSelectedSubject2] = useState(null);
  const [selectedSubject3, setSelectedSubject3] = useState(null);
  const [selectedSubject4, setSelectedSubject4] = useState(null);
  const [selectedSubject5, setSelectedSubject5] = useState(null);
  const [selectedSubject6, setSelectedSubject6] = useState(null);

  const [selectedAcademicRanksCoAdviserTh, setSelectedAcademicRanksCoAdviserTh] = useState(null);
  const [selectedAcademicRanksCoAdviserEn, setSelectedAcademicRanksCoAdviserEn] = useState(null);
  const [selectedStudyPlansCoAdvisorQe, setSelectedStudyPlansCoAdvisorQe] = useState(null);
  const [selectedEnteredSemesterQe, setSelectedEnteredSemesterQe] = useState(null);
  const [selectedResultsQe, setSelectedResultsQe] = useState(null);
  const [selectedResultsQe2, setSelectedResultsQe2] = useState(null);
  const [selectedEnteredSemesterPassedExamQe, setSelectedEnteredSemesterPassedExamQe] = useState(null);
  const [selectedEnteredSemesterPassedExamQe2, setSelectedEnteredSemesterPassedExamQe2] = useState(null);
  const [selectedLecturerNumber, setSelectedLecturerNumber] = useState(null);
  const [selectedLecturerNames, setSelectedLecturerNames] = useState(null);

  const [checkEducational, setCheckEducational] = useState(false);
  const [checkMasters, setCheckMasters] = useState(false);
  const [score, setScore] = useState(null);
  const [autoSeletor, setAutoSeletor] = useState(false);
  const [autoSeletor2, setAutoSeletor2] = useState(false);
  const [autoSeletorMaster1, setAutoSeletorMaster1] = useState(false);
  const [autoSeletorMaster2, setAutoSeletorMaster2] = useState(false);
  const [scoreCondition, setScoreCondition] = useState(0);
  const [scoreIELTS, setScoreIELTS] = useState(null);
  const [autoSeletorIELTS, setAutoSeletorIELTS] = useState(false);
  const [autoSeletorIELTS2, setAutoSeletorIELTS2] = useState(false);
  const [autoSeletorMastersIELTS, setAutoSeletorMastersIELTS] = useState(false);
  const [autoSeletorMastersIELTS2, setAutoSeletorMastersIELTS2] = useState(false);

  const [scoreConditionIELTS, setScoreConditionIELTS] = useState(0);
  const [scoreTOEFL, setScoreTOEFL] = useState(null);
  const [autoSeletorTOEFL, setAutoSeletorTOEFL] = useState(false);
  const [autoSeletorTOEFL2, setAutoSeletorTOEFL2] = useState(false);
  const [autoSeletorMastersTOEFL, setAutoSeletorMastersTOEFL] = useState(false);
  const [autoSeletorMastersTOEFL2, setAutoSeletorMastersTOEFL2] = useState(false);
  const [scoreConditionTOEFL, setScoreConditionTOEFL] = useState(0);
  const [showCourseSelection, setShowCourseSelection] = useState(true);

  // Dropdown options
  const degreeOptions = [
    { label: 'ปริญญาตรี', value: 'bachelor' },
    { label: 'ปริญญาโท', value: 'master' },
    { label: 'ปริญญาเอก', value: 'doctoral' },
  ];

  const getMasterMajorOptions = () => {
    if (selectedDegree) {
      if (selectedDegree.value === 'bachelor') {
        return [
          { label: 'เภสัชศาสตร์ Pharmaceutical Sciences', value: '1' },
          { label: 'การบริบาลทางเภสัชกรรม Pharmaceutical Care', value: '2' },
        ];
      } else if (selectedDegree.value === 'master') {
        return [
          { label: 'master1', value: '3' },
          { label: 'master2', value: '4' },
        ];
      } else if (selectedDegree.value === 'doctoral') {
        return [
          { label: 'master4', value: '5' },
          { label: 'master5', value: '6' },
        ];
      }
    } else {
      return MASTERS_MAJOR;
    }
  };

  // DataMasterPageTwo
  const [selectResolution1, setSelectResolution1] = useState(null);
  const [selectResolution2, setSelectResolution2] = useState(null);
  const [date_notify, setDateNotify] = useState(null);
  const [date_quiz, setDateQuiz] = useState(null);

  // DataMasterPageThree
  const [selectPosition, setSelecPosition] = useState(null);

  const [data, setData] = useState({
    person_th: '',
    foreign: '',
    student_status: '',
    major_master_id: '',
    degree: '',
    nametites_th: '',
    nametites_en: '',
    name_th: '',
    lastname_th: '',
    name_en: '',
    lastname_en: '',
    student_id: '',
    email: '',
    country: '',
    studyplan: '',
    semester: '',
    year_first_admission: '',
    cu_tep: false,
    cu_tep_pass: '',
    ielts: false,
    ielts_pass: '',
    toefl: false,
    toefl_pass: '',
    subject1: '',
    subject2: '',
    office: '',
    position: '',
    education_certificate_bachelor_degrees: '',
    bachelor_degrees: '',
    bachelor_faculty: '',
    bachelor_major: '',
    bachelor_country: '',
    bachelor_university: '',
    bachelor_year_completion: '',
    bachelor_gpa: '',
    education_certificate_master_degrees: 'test',
    master_degrees: '',
    master_faculty: '',
    master_major: '',
    master_university: '',
    master_country: '',
    master_year_completion: '',
    master_gpa: '',
    graduate_advisor: {
      id: null,
      advisor_qe: '',
      advisor_type: '',
      thesis_advisor_qe_th: '',
      thesis_advisor_qe_en: '',
      department_advisor_qe: '',
      faculty_advisor_qe: '',
      academic_ranks_advisor_qe_th: '',
      academic_ranks_advisor_qe_en: '',

      academic_rank_manager_qe: '',
      affiliation_advisor_qe: '',
      program_studyth_advisor_qe: '',
      program_studyen_advisor_qe: '',
      field_studyth_advisor_qe: '',
      field_studyen_advisor_qe: '',
      study_plans_advisor_qe: '',
      entered_semester_qe: '',
      academic_year_qe: '',
      date_advisor_qe: '',
      results_qe: '',
      entered_semester_passed_exam_qe: '',
      academic_year_passed_exam_qe: '',
      results_qe2: '',
      entered_semester_passed_exam_qe2: '',
      academic_year_passed_exam_qe2: '',
      start_date_advisor_qe: '',
      end_date_advisor_qe: '',
      graduate_co_advisor: [
        {
          // id: null,
          // advisor_co_type: '',
          // thesis_co_advisor_qe_th: '',
          // thesis_co_advisor_qe_en: '',
          // department_co_advisor_qe: '',
          // faculty_co_advisor_qe: '',
          // academic_ranks_co_advisor_qe_th: '',
          // academic_ranks_co_advisor_qe_en: '',
          // academic_rank_co_manager_qe: '',
          // affiliation_co_advisor_qe: '',
          // program_studyth_co_advisor_qe: '',
          // program_studyen_co_advisor_qe: '',
          // field_studyth_co_advisor_qe: '',
          // field_studyen_co_advisor_qe: '',
          // study_plans_co_advisor_qe: '',
        },
      ],
      name_chairpersonth_qe: '',
      name_chairpersonen_qe: '',
      graduate_member_advisor: [
        {
          name_memberth_qe: '',
          name_memberen_qe: '',
        },
      ],
    },
  });
  const [defData, setDefData] = useState({});
  const [defExData, setDefExData] = useState({});
  const [pubData, setPubData] = useState({});
  const [gradData, setGradData] = useState({});
  const [dataChild, setFormDataChild] = useState({});

  const [coAdvisorFields, setCoAdvisorFields] = useState([
    // {
    //   // advisor_co_type: '',
    //   // thesis_co_advisor_qe_th: '',
    //   // thesis_co_advisor_qe_en: '',
    //   // department_co_advisor_qe: '',
    //   // faculty_co_advisor_qe: '',
    //   // academic_ranks_co_advisor_qe_th: '',
    //   // academic_ranks_co_advisor_qe_th: '',
    //   // academic_rank_co_manager_qe: '',
    //   // affiliation_co_advisor_qe: '',
    //   // program_studyth_co_advisor_qe: '',
    //   // program_studyen_co_advisor_qe: '',
    //   // field_studyth_co_advisor_qe: '',
    //   // field_studyen_co_advisor_qe: '',
    //   // study_plans_co_advisor_qe: '',
    //   // entered_semester_qe: '',
    //   // academic_year_qe: '',
    // },
  ]);
  const [nextId, setNextId] = useState(fetchDataCo ? fetchDataCo.length + 1 : 2);
  const [bacsFields, setBacsFields] = useState([]);
  const [bacsId, setBacsId] = useState(fetchDataBacs ? fetchDataBacs.length + 1 : 2);

  const handleMasterStatusChange = (event, newValue) => {
    setSelectedMasterStatus(newValue);
    data.student_status = newValue;
  };
  const handleMasterMajor = (event, newValue) => {
    setSelectedMasterMajor(newValue);
    data.major_master_id = newValue?.value || '';
  };
  const handleDegree = (event, newValue) => {
    setSelectedDegree(newValue);
    data.degree = newValue?.value || '';
  };
  const handleMasterNamePrefixThChange = (event, newValue) => {
    setSelectedMasterNamePrefixTh(newValue);
    data.nametites_th = newValue;
  };
  const handleMasterNamePrefixEnChange = (event, newValue) => {
    setSelectedMasterNamePrefixEn(newValue);
    data.nametites_en = newValue;
  };
  const handleMasterCountryChange = (event, newValue) => {
    setSelectedMasterCountry(newValue);
    data.country = newValue;
  };
  const handleMasterStudyPlan = (event, newValue) => {
    setSelectedMasterStudyPlan(newValue);
    data.studyplan = newValue;
  };
  const handleMasterSemester = (event, newValue) => {
    if (newValue) {
      setSelectedMasterSemester(newValue.label);
      data.semester = newValue.value;
    } else {
      setSelectedMasterSemester(null);
      data.semester = null;
    }
  };
  const handleBachelorUniversityCountry = (event, newValue) => {
    setSelectedBachelorUniversityCountry(newValue);
    data.bachelor_country = newValue;
  };
  const handleMasterUniversityCountry = (event, newValue) => {
    setSelectedMasterUniversityCountry(newValue);
    data.master_country = newValue;
  };
  const handleAcademicRanksAdviserTh = (event, newValue) => {
    setSelectedAcademicRanksAdviserTh(newValue);
    data.graduate_advisor.academic_ranks_advisor_qe_th = newValue;
  };
  const handleAcademicRanksAdviserEn = (event, newValue) => {
    setSelectedAcademicRanksAdviserEn(newValue);
    data.graduate_advisor.academic_ranks_advisor_qe_en = newValue;
  };
  const handleStudyPlansAdvisorQe = (event, newValue) => {
    setSelectedStudyPlansAdvisorQe(newValue);
    data.graduate_advisor.study_plans_advisor_qe = newValue;
  };
  const handleStudyPlansCoAdvisorQe = (event, newValue) => {
    setSelectedStudyPlansCoAdvisorQe(newValue);
    data.graduate_advisor.study_plans_co_advisor_qe = newValue;
  };
  const handleAcademicRanksCoAdviserTh = (event, newValue) => {
    setSelectedAcademicRanksCoAdviserTh(newValue);
    data.graduate_advisor.academic_ranks_co_advisor_qe_th = newValue;
  };
  const handleAcademicRanksCoAdviserEn = (event, newValue) => {
    setSelectedAcademicRanksCoAdviserEn(newValue);
    data.graduate_advisor.academic_ranks_co_advisor_qe_en = newValue;
  };
  const handleEnteredSemesterQe = (event, newValue) => {
    console.log('newValue =>', newValue);
    if (newValue === null) {
      setSelectedEnteredSemesterQe(null);
      data.graduate_advisor.entered_semester_qe = '';
      console.log('remove ');
    } else {
      setSelectedEnteredSemesterQe(newValue.label);
      data.graduate_advisor.entered_semester_qe = newValue.value;
      console.log('add ');
    }
    console.log('data.graduate_advisor.entered_semester_qe =>', data.graduate_advisor.entered_semester_qe);
    console.log(
      'option',
      semesterOptions.find((option) => option.value === data.graduate_advisor.entered_semester_qe)
    );
  };
  const handleResultsQe = (event, newValue) => {
    setSelectedResultsQe(newValue);
    data.graduate_advisor.results_qe = newValue;
  };
  const handleResultsQe2 = (event, newValue) => {
    setSelectedResultsQe2(newValue);
    data.graduate_advisor.results_qe2 = newValue;
  };
  const handleEnteredSemesterPassedExamQe = (event, newValue) => {
    setSelectedEnteredSemesterPassedExamQe(newValue);
    data.graduate_advisor.entered_semester_passed_exam_qe = newValue;
  };
  const handleEnteredSemesterPassedExamQe2 = (event, newValue) => {
    setSelectedEnteredSemesterPassedExamQe2(newValue);
    data.graduate_advisor.entered_semester_passed_exam_qe2 = newValue;
  };
  const handleLecturerNumber = (event, newValue) => {
    setSelectedLecturerNumber(newValue);
    data.graduate_advisor.lecturer_number = newValue;
  };
  const handleSubject1 = (event, newValue) => {
    setSelectedSubject1(newValue);
    data.subject = '5500 503 Preparatory English for Graduate Student';
    data.subject2 = newValue;
  };
  const handleSubject2 = (event, newValue) => {
    setSelectedSubject2(newValue);
    data.subject = null;
    data.subject2 = newValue;
  };
  const handleSubject3 = (event, newValue) => {
    setSelectedSubject3(newValue);
    data.subject = '5500 503 Preparatory English for Graduate Student';
    data.subject2 = newValue;
  };
  const handleSubject4 = (event, newValue) => {
    setSelectedSubject4(newValue);
    data.subject = null;
    data.subject2 = newValue;
  };
  const handleSubject5 = (event, newValue) => {
    setSelectedSubject5(newValue);
    data.subject = newValue;
  };
  const handleSubject6 = (event, newValue) => {
    setSelectedSubject6(newValue);
    data.subject2 = newValue;
  };

  const {
    fields: DateFields,
    append: appendDate,
    remove: removeDate,
  } = useFieldArray({
    control,
    name: 'date',
  });

  const handleAddDate = () => {
    appendDate({
      dateate: '',
    });
  };

  const handleRemoveDate = (index) => {
    console.log('index :>> ', index);
    removeDate(index);
  };

  const addField = () => {
    setCoAdvisorFields([...coAdvisorFields, { id: nextId }]);
    setNextId(nextId + 1);
  };

  const removeField = (index) => {
    const list = [...coAdvisorFields];
    list.splice(index, 1);
    setCoAdvisorFields(list);
    if (data.graduate_advisor.graduate_co_advisor) {
      setData((prevData) => {
        const updatedCoAdvisor = [...prevData.graduate_advisor.graduate_co_advisor];
        updatedCoAdvisor.splice(index, 1);
        return {
          ...prevData,
          graduate_advisor: {
            ...prevData.graduate_advisor,
            graduate_co_advisor: updatedCoAdvisor,
          },
        };
      });
    }
  };

  const addBacsField = () => {
    setBacsFields([...bacsFields, { id: bacsId }]);
    setBacsId(bacsId + 1);
  };

  const removeBacsField = (index) => {
    const list = [...bacsFields];
    list.splice(index, 1);
    setBacsFields(list);
    setData((prevData) => {
      const updatedChairman = [...prevData.graduate_advisor.graduate_member_advisor];
      updatedChairman.splice(index, 1);
      return {
        ...prevData,
        graduate_advisor: {
          ...prevData.graduate_advisor,
          graduate_member_advisor: updatedChairman,
        },
      };
    });
  };

  const values = watch();

  const [selectCoAdvisoreacher, setSelectCoAdvisoreacher] = useState([]);
  const [selectCoAdvisorOption, setSelectCoAdvisorOption] = useState([
    values.options_1 ? true : false,
    values.options_2 ? true : false,
  ]);

  const [checked, setChecked] = useState(Array(21).fill(false));
  const [checkedSub, setCheckedSub] = useState([
    values.workload_hours_5_1 ? true : false,
    values.workload_hours_5_2 ? true : false,
    values.workload_hours_9_1 ? true : false,
    values.workload_hours_9_1 ? true : false,
    values.workload_hours_10_1 ? true : false,
    values.workload_hours_10_2 ? true : false,
    values.workload_hours_11_1 ? true : false,
    values.workload_hours_11_2 ? true : false,
    values.workload_hours_11_3 ? true : false,
    values.workload_hours_11_4 ? true : false,
  ]);

  const handleCheckedChange = (index) => {
    const newChecked = [...checked];
    if (newChecked[index]) {
      newChecked[index] = false;
    } else {
      newChecked.fill(false);
      newChecked[index] = true;
    }
    setChecked(newChecked);
  };

  const handleCheckedChange2 = (index) => {
    setChecked({ ...checked, [index]: !checked[index] });
  };

  //-------------stepper--------------------------------------------------

  const [selectNation, setSelectNation] = useState(null);
  const [selectTeacher, setSelecTeacher] = useState(null);
  const [selectCoadvisor, setSelecCoadvisor] = useState(null);
  const [selectCo_advisoreacher, setSelecCo_advisor] = useState(null);

  const [selectTeacher2, setSelecTeacher2] = useState(null);
  const [selectCo_advisoreacher2, setSelecCo_advisor2] = useState(null);

  const [date, setDate] = useState(null);
  const [datetraining, setDateTraining] = useState(null);
  const [fetchDataCo, setFetchDataCo] = useState([]);
  const [fetchDataBacs, setFetchDataBacs] = useState([]);
  const [count, setCount] = useState(0);

  const [forceRender, setForceRender] = useState(false);

  const onChange = (i) => {
    setSelectNation((prev) => (i === prev ? null : i));
  };

  const onChangeTeacher = (i) => {
    setSelecTeacher((prev) => (i === prev ? null : i));
    // data.graduate_advisor.advisor_type = i === 0 ? 'internal' : 'external';
    setData((prevData) => ({
      ...prevData,
      graduate_advisor: {
        ...prevData.graduate_advisor,
        advisor_type: i === 0 ? 'internal' : 'external',
      },
    }));
  };

  const onChangeCo_advisor = (index, value) => {
    setSelectCoAdvisoreacher((prevState) => {
      const updatedSelectCoAdvisoreacher = [...prevState];
      updatedSelectCoAdvisoreacher[index] = { value };
      console.log('updatedSelectCoAdvisoreacher', updatedSelectCoAdvisoreacher);
      return updatedSelectCoAdvisoreacher;
    });

    if (!data.graduate_advisor.graduate_co_advisor) {
      setData((prevData) => ({
        ...prevData,
        graduate_advisor: {
          ...prevData.graduate_advisor,
          graduate_co_advisor: [
            {
              advisor_co_type: value === '1' ? 'internal' : 'external',
              thesis_co_advisor_qe_th: '',
              thesis_co_advisor_qe_en: '',
              department_co_advisor_qe: '',
              faculty_co_advisor_qe: '',
              academic_ranks_co_advisor_qe_th: '',
              academic_ranks_co_advisor_qe_th: '',

              academic_rank_co_manager_qe: '',
              affiliation_co_advisor_qe: '',
              program_studyth_co_advisor_qe: '',
              program_studyen_co_advisor_qe: '',
              field_studyth_co_advisor_qe: '',
              field_studyen_co_advisor_qe: '',
              study_plans_co_advisor_qe: '',
              entered_semester_qe: '',
              academic_year_qe: '',
            },
          ],
        },
      }));
    }

    if (data.graduate_advisor.graduate_co_advisor) {
      const updatedCoAdvisor = [...data.graduate_advisor.graduate_co_advisor];
      updatedCoAdvisor[index] = {
        ...updatedCoAdvisor[index],
        advisor_co_type: value === '1' ? 'internal' : 'external',
      };
      setData((prevData) => ({
        ...prevData,
        graduate_advisor: {
          ...prevData.graduate_advisor,
          graduate_co_advisor: updatedCoAdvisor,
        },
      }));
    }
    console.log('data.graduate_advisor.graduate_co_advisor', data.graduate_advisor.graduate_co_advisor);
  };

  const onChangeTeacher2 = (i) => {
    setSelecTeacher2((prev) => (i === prev ? null : i));
  };

  const onChangeCo_advisor2 = (i) => {
    setSelecCo_advisor2((prev) => (i === prev ? null : i));
  };

  const onChange1 = (i) => {
    setSelectResolution1((prev) => (i === prev ? null : i));
  };
  const onChange2 = (i) => {
    setSelectResolution2((prev) => (i === prev ? null : i));
  };

  const verifyEducational = () => {
    if (score >= 30 && score <= 37) {
      setScoreCondition(score);
    } else {
      setScoreCondition(null);
    }
  };

  const verifyScore = () => {
    if (checked[4] && !checked[5]) {
      if (score >= 30 && score <= 37) {
        setAutoSeletor(true);
        setAutoSeletor2(false);
        data.cu_tep_pass = true;
      } else if (score >= 38 && score <= 44) {
        setAutoSeletor2(true);
        setAutoSeletor(false);
        data.cu_tep_pass = true;
      } else if (score >= 45) {
        setAutoSeletor(false);
        setAutoSeletor2(false);
        data.cu_tep_pass = true;
      } else if (score <= 29) {
        data.cu_tep_pass = false;
      }
    } else if (checked[5]) {
      if (score >= 45 && score <= 59) {
        setAutoSeletorMaster1(true);
        setAutoSeletorMaster2(false);
        data.cu_tep_pass = true;
      } else if (score >= 60 && score <= 66) {
        setAutoSeletorMaster2(true);
        setAutoSeletorMaster1(false);
        data.cu_tep_pass = true;
      } else if (score >= 67) {
        setAutoSeletorMaster1(false);
        setAutoSeletorMaster2(false);
        data.cu_tep_pass = true;
      } else if (score <= 44) {
        data.cu_tep_pass = false;
      }
    }
  };
  const verifyScoreTOEFL = () => {
    if (checked[4] && !checked[5]) {
      if (scoreTOEFL >= 400 && scoreTOEFL <= 424) {
        setAutoSeletorTOEFL(true);
        setAutoSeletorTOEFL2(false);
        data.toefl_pass = true;
      } else if (scoreTOEFL >= 425 && scoreTOEFL <= 449) {
        setAutoSeletorTOEFL2(true);
        setAutoSeletorTOEFL(false);
        data.toefl_pass = true;
      } else if (scoreTOEFL >= 450) {
        setAutoSeletorTOEFL(false);
        setAutoSeletorTOEFL2(false);
        data.toefl_pass = true;
      } else if (scoreTOEFL <= 399) {
        data.toefl_pass = false;
      }
    } else if (checked[4] && checked[5]) {
      if (scoreTOEFL >= 450 && scoreTOEFL <= 499) {
        setAutoSeletorMastersTOEFL(true);
        setAutoSeletorMastersTOEFL2(false);
        data.toefl_pass = true;
      } else if (scoreTOEFL >= 500 && scoreTOEFL <= 524) {
        setAutoSeletorMastersTOEFL2(true);
        setAutoSeletorMastersTOEFL(false);
        data.toefl_pass = true;
      } else if (scoreTOEFL >= 525) {
        setAutoSeletorMastersTOEFL(false);
        setAutoSeletorMastersTOEFL2(false);
        data.toefl_pass = true;
      } else if (scoreTOEFL <= 449) {
        data.toefl_pass = false;
      }
    }
  };
  const verifyScoreIELTS = () => {
    if (checked[4] && !checked[5]) {
      if (scoreIELTS >= 3.0 && scoreIELTS <= 3.4) {
        setAutoSeletorIELTS(true);
        setAutoSeletorIELTS2(false);
        data.ielts_pass = true;
      } else if (scoreIELTS >= 3.5 && scoreIELTS <= 3.9) {
        setAutoSeletorIELTS2(true);
        setAutoSeletorIELTS(false);
        data.ielts_pass = true;
      } else if (scoreIELTS >= 4) {
        setAutoSeletorIELTS(false);
        setAutoSeletorIELTS2(false);
        data.ielts_pass = true;
      } else if (scoreIELTS <= 2.9) {
        data.ielts_pass = false;
      }
    } else if (checked[4] && checked[5]) {
      if (scoreIELTS >= 4 && scoreIELTS <= 4.4) {
        setAutoSeletorMastersIELTS(true);
        setAutoSeletorMastersIELTS2(false);
        data.ielts_pass = true;
      } else if (scoreIELTS >= 4.5 && scoreIELTS <= 5.4) {
        setAutoSeletorMastersIELTS2(true);
        setAutoSeletorMastersIELTS(false);
        data.ielts_pass = true;
      } else if (scoreIELTS >= 5.5) {
        setAutoSeletorMastersIELTS(false);
        setAutoSeletorMastersIELTS2(false);
        data.ielts_pass = true;
      } else if (scoreIELTS <= 3.9) {
        data.ielts_pass = false;
      }
    }
  };

  const verifyEducationalIELTS = () => {
    // if (scoreIELTS >= 400 && scoreIELTS <= 424) {
    //   setScoreConditionIELTS(scoreIELTS);
    // } else {
    //   setScoreConditionIELTS(null);
    // }
  };

  const child2Ref = useRef(null);
  const child3Ref = useRef(null);
  const child4Ref = useRef(null);
  const child5Ref = useRef(null);
  const [submittedData2, setSubmittedData2] = React.useState(null);
  const [submittedData3, setSubmittedData3] = React.useState(null);
  const [submittedData4, setSubmittedData4] = React.useState(null);
  const [submittedData5, setSubmittedData5] = React.useState(null);

  const handleBack = () => {
    handleChangeWorkloadClear('dashboard');
  };
  const handleFormSubmit = () => {
    console.log('data beforer set =>', data);
    if (!checked[0] && !editMode) {
      data.cu_tep = '';
      data.cu_tep_pass = '';
      data.subject1 = '';
      data.subject2 = '';
    }
    if (!checked[2] && !editMode) {
      data.toefl = '';
      data.toefl_pass = '';
      data.subject1 = '';
      data.subject2 = '';
    }
    if (!checked[1] && !editMode) {
      data.ielts = '';
      data.ielts_pass = '';
      data.subject1 = '';
      data.subject2 = '';
    }

    if (checked[0] && score) {
      data.cu_tep = score;
      console.log('data.cu_tep =>', data.cu_tep);
    } else if (checked[2] && scoreTOEFL) {
      data.toefl = scoreTOEFL;
      console.log('data.toefl =>', data.toefl);
    } else if (checked[1] && scoreIELTS) {
      data.ielts = scoreIELTS;
      console.log('data.ielts =>', data.ielts);
    }

    if (!checked[4]) {
      data.education_certificate_bachelor_degrees = false;
      data.bachelor_degrees = '';
      data.bachelor_faculty = '';
      data.bachelor_major = '';
      data.bachelor_country = '';
      data.bachelor_university = '';
      data.bachelor_year_completion = '';
      data.bachelor_gpa = '';
    }
    if (!checked[5]) {
      data.education_certificate_master_degrees = false;
      data.master_faculty = '';
      data.master_major = '';
      data.master_country = '';
      data.master_university = '';
      data.master_year_completion = '';
      data.master_gpa = '';
    }

    if (checked[4]) {
      data.education_certificate_bachelor_degrees = true;
    }

    if (checked[5]) {
      data.education_certificate_master_degrees = true;
    }

    if (checked[20]) {
      data.graduate_advisor.advisor_qe = true;
    }

    if (checked[0] && autoSeletor && !checkMasters) {
      data.subject1 = '5500 503 Preparatory English for Graduate Student';
      data.subject2 = selectedSubject1 ? selectedSubject1 : data.subject2;
    } else if (checked[0] && autoSeletor2 && !checkMasters) {
      data.subject1 = selectedSubject2 ? selectedSubject2 : data.subject1;
    } else if (checked[0] && autoSeletorMaster1 && checkMasters) {
      data.subject1 = '5500 532 Academic English for Graduate Studies';
      data.subject2 = '5500 560 Thesis Writing';
    } else if (checked[0] && autoSeletorMaster2 && checkMasters) {
      data.subject1 = '5500 560 Thesis Writing';
    } else if (checked[2] && autoSeletorTOEFL && !checkMasters) {
      data.subject1 = '5500 503 Preparatory English for Graduate Student';
      data.subject2 = selectedSubject3 ? selectedSubject3 : data.subject2;
    } else if (checked[2] && autoSeletorTOEFL2 && !checkMasters) {
      data.subject1 = selectedSubject4 ? selectedSubject4 : data.subject1;
    } else if (checked[2] && autoSeletorMastersTOEFL && checkMasters) {
      data.subject1 = '5500 532 Academic English for Graduate Studies';
      data.subject2 = '5500 560 Thesis Writing';
    } else if (checked[2] && autoSeletorMastersTOEFL2 && checkMasters) {
      data.subject1 = '5500 560 Thesis Writing';
    } else if (checked[1] && autoSeletorIELTS && !checkMasters) {
      data.subject1 = '5500 503 Preparatory English for Graduate Student';
      data.subject2 = selectedSubject5 ? selectedSubject5 : data.subject2;
    } else if (checked[1] && autoSeletorIELTS2 && !checkMasters) {
      data.subject1 = selectedSubject2 ? selectedSubject2 : data.subject1;
    } else if (checked[1] && autoSeletorMastersIELTS && checkMasters) {
      data.subject1 = '5500 532 Academic English for Graduate Studies';
      data.subject2 = '5500 560 Thesis Writing';
    } else if (checked[1] && autoSeletorMastersIELTS2 && checkMasters) {
      data.subject1 = '5500 560 Thesis Writing';
    }

    if (data.graduate_advisor && data.graduate_advisor.entered_semester_defense) {
      console.log('entered_semester_qe');
      if (data.graduate_advisor.entered_semester_qe) {
        if (data.graduate_advisor.entered_semester_qe === 'ต้น') {
          data.graduate_advisor.entered_semester_qe = 1;
          console.log('ต้น');
        } else if (data.graduate_advisor.entered_semester_qe === 'ปลาย') {
          data.graduate_advisor.entered_semester_qe = 2;
          console.log('ปลาย');
        } else if (data.graduate_advisor.entered_semester_qe === 'ซัมเมอร์') {
          data.graduate_advisor.entered_semester_qe = 3;
          console.log('ซัมเมอร์');
        }
      }
    }
    if (data.graduate_defense && data.graduate_defense.entered_semester_defense) {
      console.log('entered_semester_defense');
      if (data.graduate_defense.entered_semester_defense) {
        if (data.graduate_defense.entered_semester_defense === 'ต้น') {
          data.graduate_defense.entered_semester_defense = 1;
          console.log('ต้น');
        } else if (data.graduate_defense.entered_semester_defense === 'ปลาย') {
          data.graduate_defense.entered_semester_defense = 2;
          console.log('ปลาย');
        } else if (data.graduate_defense.entered_semester_defense === 'ซัมเมอร์') {
          data.graduate_defense.entered_semester_defense = 3;
          console.log('ซัมเมอร์');
        }
      }
    }
    if (data.graduate_defense_examination && data.graduate_defense_examination.entered_semester_defense_examination) {
      console.log('entered_semester_defense_examination');
      if (data.graduate_defense_examination.entered_semester_defense_examination) {
        if (data.graduate_defense_examination.entered_semester_defense_examination === 'ต้น') {
          data.graduate_defense_examination.entered_semester_defense_examination = 1;
          console.log('ต้น');
        } else if (data.graduate_defense_examination.entered_semester_defense_examination === 'ปลาย') {
          data.graduate_defense_examination.entered_semester_defense_examination = 2;
          console.log('ปลาย');
        } else if (data.graduate_defense_examination.entered_semester_defense_examination === 'ซัมเมอร์') {
          data.graduate_defense_examination.entered_semester_defense_examination = 3;
          console.log('ซัมเมอร์');
        }
      }
    }
    if (data.graduate_advisor && data.graduate_advisor.graduate_co_advisor) {
      data.graduate_advisor.graduate_co_advisor = data.graduate_advisor.graduate_co_advisor.map((advisor) => {
        return {
          advisor_co_type: advisor.advisor_co_type || null,
          thesis_co_advisor_qe_th: advisor.thesis_co_advisor_qe_th || null,
          thesis_co_advisor_qe_en: advisor.thesis_co_advisor_qe_en || null,
          department_co_advisor_qe: advisor.department_co_advisor_qe || null,
          faculty_co_advisor_qe: advisor.faculty_co_advisor_qe || null,
          academic_ranks_co_advisor_qe_th: advisor.academic_ranks_co_advisor_qe_th || null,
          academic_ranks_co_advisor_qe_en: advisor.academic_ranks_co_advisor_qe_en || null,
          academic_rank_co_manager_qe: advisor.academic_rank_co_manager_qe || null,
          affiliation_co_advisor_qe: advisor.affiliation_co_advisor_qe || null,
          program_studyth_co_advisor_qe: advisor.program_studyth_co_advisor_qe || null,
          program_studyen_co_advisor_qe: advisor.program_studyen_co_advisor_qe || null,
          field_studyth_co_advisor_qe: advisor.field_studyth_co_advisor_qe || null,
          field_studyen_co_advisor_qe: advisor.field_studyen_co_advisor_qe || null,
          study_plans_co_advisor_qe: advisor.study_plans_co_advisor_qe || null,
          entered_semester_qe: advisor.entered_semester_qe || null,
        };
      });
    }

    if (data.graduate_advisor && data.graduate_advisor.graduate_member_advisor) {
      data.graduate_advisor.graduate_member_advisor = data.graduate_advisor.graduate_member_advisor.map((advisor) => {
        return {
          name_memberth_qe: advisor.name_memberth_qe || null,
          name_memberen_qe: advisor.name_memberen_qe || null,
        };
      });
    }
    if (data.graduate_advisor?.results_qe === null) {
      data.graduate_advisor.results_qe = '';
    }

    const formData = null;
    const updatedFormData = { ...data };

    console.log('updatedFormData =>', updatedFormData);
    console.log('data =>', data);
    if (!updatedFormData.graduate_advisor?.lecturer_number || !checked[20]) {
      delete updatedFormData.graduate_advisor;
      console.log('graduate_advisor deleted');
    }
    if (!updatedFormData.graduate_defense?.lecturer_number) {
      delete updatedFormData.graduate_defense;
      console.log('graduate_defense deleted');
    }
    if (!updatedFormData.graduate_defense_examination?.lecturer_number) {
      delete updatedFormData.graduate_defense_examination;
      console.log('graduate_defense_examination deleted');
    }
    if (data.graduate_published?.published != 1) {
      delete updatedFormData.graduate_published;
      console.log('graduate_published deleted');
    }
    if (data.graduate_graduation?.graduation != 1) {
      delete updatedFormData.graduate_graduation;
      console.log('graduate_graduation deleted');
    }
    const options = {
      indices: true,
      allowEmptyArrays: false,
      booleansAsIntegers: true,
      nullsAsUndefineds: true,
    };
    console.log('updatedFormData 2 =>', updatedFormData);

    // const removedNull = removeNullAndEmptyDeep(updatedFormData);
    formData = serialize(updatedFormData, options);

    Swal.fire({
      title: 'ต้องการบันทึกฐานข้อมูลบัณฑิตศึกษานี้หรือไม่ ?',
      text: 'กดยืนยันเพื่อดำเนินการต่อ',
      icon: 'warning',
      confirmButton: 'btn btn-success',
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        const endpoint = editMode ? `/graduate-student/${dataForEdit}` : '/graduate-student/create-one';
        console.log('formData =>', formData);
        axios
          .post(endpoint, formData)
          .then((response) => {
            console.log('created success!!');
            Swal.mixin({ allowOutsideClick: false }).fire(
              'บันทึกสำเร็จ',
              'ฐานข้อมูลบัณฑิตศึกษา ถูกบันทึกแล้ว',
              'success'
            );
            dispatch(setRenderPage('dashboard'));
            console.log('Response:', response.data);
          })
          .catch((error) => {
            let errorMessage = 'บันทึกไม่สำเร็จ';
            if (error.response && error.response.data && error.response.data.message) {
              errorMessage = error.response.data.message;
            } else if (error.message) {
              errorMessage = error.message;
            }
            Swal.mixin({ allowOutsideClick: false }).fire(
              'เกิดข้อผิดพลาด',
              'บันทึกฐานข้อมูลบัณฑิตศึกษาไม่สำเร็จ',
              `(${errorMessage})`,
              'error'
            );
            console.error('Error:', error);
            dispatch(setRenderPage('dashboard'));
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  };

  const handleFormChange = (child, data) => {
    setData((prevData) => ({
      ...prevData,
      [child]: data,
    }));
    console.log('handleFormChange =>', data);
  };

  // const handleChange = (event) => {
  //   const { name, value } = event.target;
  //   setData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const updatedFormData = {
      ...data,
      [name]: value,
      // graduate_qe: {
      //   ...data.graduate_qe,
      //   [name]: value,
      // },
    };
    setData(updatedFormData);
  };
  const handleChangeAdvisor = (event) => {
    const { name, value } = event.target;
    const updatedFormData = {
      ...data,
      graduate_advisor: {
        ...data.graduate_advisor,
        [name]: value,
      },
    };
    setData(updatedFormData);
  };

  const handleChangeAdvisorName = (event, newValue) => {
    setSelectedLecturerNames(newValue);
    data.graduate_advisor.thesis_advisor_qe_th = newValue;
    const foundLecturer = lecturer.find((lecturer) => lecturer.fullname_th === newValue);
    if (foundLecturer) {
      data.graduate_advisor.lecturer_number = foundLecturer.lecturer_number;
      data.graduate_advisor.thesis_advisor_qe_th = foundLecturer.fullname_th;
      data.graduate_advisor.thesis_advisor_qe_en = foundLecturer.fullname_en;
      data.graduate_advisor.department_advisor_qe = foundLecturer.affiliation;
      data.graduate_advisor.faculty_advisor_qe = 'คณะเภสัชศาสตร์';
    }
  };

  const handleArrayChange = (index, fieldName, value) => {
    const chairpersonAdvisor = data.graduate_advisor.graduate_member_advisor || []; // Ensure it's an array

    if (index === chairpersonAdvisor.length) {
      setData((prevData) => ({
        ...prevData,
        graduate_advisor: {
          ...prevData.graduate_advisor,
          graduate_member_advisor: [
            ...chairpersonAdvisor,
            {
              name_memberth_qe: '',
              name_memberen_qe: '',
            },
          ],
        },
      }));
    }

    const updatedChairman = [...chairpersonAdvisor];
    updatedChairman[index] = {
      ...updatedChairman[index],
      [fieldName]: value,
    };

    setData((prevData) => ({
      ...prevData,
      graduate_advisor: {
        ...prevData.graduate_advisor,
        graduate_member_advisor: updatedChairman,
      },
    }));
  };

  const handleCoAdvisorChange = (index, fieldName, value) => {
    console.log('Value', value);
    if (!data.graduate_advisor.graduate_co_advisor) {
      setData((prevData) => ({
        ...prevData,
        graduate_advisor: {
          graduate_co_advisor: [
            {
              member_defense_type: '',
              name_member_th_defense: '',
              name_member_en_defense: '',
              co_department: '',
              co_group: '',
              academic_rank_member_th_defense: '',
              academic_rank_member_en_defense: '',
              academic_rank_manager_defense: '',
              affiliation_member_defense: '',
              co_course_th: '',
              co_course_en: '',
              co_branch_th: '',
              co_branch_en: '',
              co_study_plan: '',
            },
          ],
        },
      }));
    }
    if (index === data.graduate_advisor.graduate_co_advisor?.length) {
      setData((prevData) => ({
        ...prevData,
        graduate_advisor: {
          ...prevData.graduate_advisor,
          graduate_co_advisor: [
            ...prevData.graduate_advisor.graduate_member_advisor,
            {
              advisor_co_type: '',
              thesis_co_advisor_qe_th: '',
              thesis_co_advisor_qe_en: '',
              department_co_advisor_qe: '',
              faculty_co_advisor_qe: '',
              academic_ranks_co_advisor_qe_th: '',
              academic_ranks_co_advisor_qe_th: '',

              academic_rank_co_manager_qe: '',
              affiliation_co_advisor_qe: '',
              program_studyth_co_advisor_qe: '',
              program_studyen_co_advisor_qe: '',
              field_studyth_co_advisor_qe: '',
              field_studyen_co_advisor_qe: '',
              study_plans_co_advisor_qe: '',
              entered_semester_qe: '',
              academic_year_qe: '',
            },
          ],
        },
      }));
    }

    if (data.graduate_advisor.graduate_co_advisor) {
      const updatedCoAdvisor = [...data.graduate_advisor.graduate_co_advisor];
      updatedCoAdvisor[index] = {
        ...updatedCoAdvisor[index],
        [fieldName]: value,
      };

      setData((prevData) => ({
        ...prevData,
        graduate_advisor: {
          ...prevData.graduate_advisor,
          graduate_co_advisor: updatedCoAdvisor,
        },
      }));
    }
  };
  const handleChangeNation = (index) => (event) => {
    const { checked } = event.target;
    const newFormData = {
      ...data,
      person_th: index === 'person_th' ? (checked ? 1 : 0) : 0,
      foreign: index === 'foreign' ? (checked ? 1 : 0) : 0,
    };
    setData(newFormData);
  };
  const getLecturerList = async () => {
    await axios
      .get('/lecturer/all')
      .then((res) => {
        // const lecturerNumbers = res.data
        //   .filter((lecturer) => lecturer !== null && lecturer.lecturer_number !== null)
        //   .map((lecturer) => lecturer.lecturer_number);
        // setLecturer(res.data);
        // setLecturerNumber(lecturerNumbers);
        const lectureNames = res.data
          .filter((lecturer) => lecturer !== null && lecturer.fullname_th !== null)
          .map((lecturer) => lecturer.fullname_th);
        setLecturer(res.data);
        setLecturerNames(lectureNames);
      })
      .then(() => {})
      .catch((err) => console.log({ lecturer: err }));
  };
  const getStudentList = async () => {
    await axios
      .get('/student')
      .then((res) => {
        // const lecturerNumbers = res.data
        //   .filter((lecturer) => lecturer !== null && lecturer.lecturer_number !== null)
        //   .map((lecturer) => lecturer.lecturer_number);
        // setLecturer(res.data);
        // setLecturerNumber(lecturerNumbers);
        const studentNames = res.data
          .filter((student) => student !== null && student.fullname_th !== null)
          .map((student) => student.fullname_th);
        setStudent(res.data);
        setStudentNames(studentNames);
      })
      .then(() => {})
      .catch((err) => console.log({ lecturer: err }));
  };
  const resetData = () => {
    setData({
      person_th: '',
      foreign: '',
      student_status: '',
      major_master_id: '',
      nametites_th: '',
      nametites_en: '',
      name_th: '',
      lastname_th: '',
      name_en: '',
      lastname_en: '',
      student_id: '',
      email: '',
      country: '',
      studyplan: '',
      semester: '',
      year_first_admission: '',
      cu_tep: false,
      cu_tep_pass: '',
      ielts: false,
      ielts_pass: '',
      toefl: false,
      toefl_pass: '',
      subject1: '',
      subject2: '',
      office: '',
      position: '',
      education_certificate_bachelor_degrees: '',
      bachelor_degrees: '',
      bachelor_faculty: '',
      bachelor_major: '',
      bachelor_country: '',
      bachelor_university: '',
      bachelor_year_completion: '',
      bachelor_gpa: '',
      education_certificate_master_degrees: 'test',
      master_degrees: '',
      master_faculty: '',
      master_major: '',
      master_university: '',
      master_country: '',
      master_year_completion: '',
      master_gpa: '',
      graduate_advisor: {
        advisor_qe: '',
        advisor_type: '',
        thesis_advisor_qe_th: '',
        thesis_advisor_qe_en: '',
        department_advisor_qe: '',
        faculty_advisor_qe: '',
        academic_ranks_advisor_qe_th: '',
        academic_ranks_advisor_qe_en: '',

        academic_rank_manager_qe: '',
        affiliation_advisor_qe: '',
        program_studyth_advisor_qe: '',
        program_studyen_advisor_qe: '',
        field_studyth_advisor_qe: '',
        field_studyen_advisor_qe: '',
        study_plans_advisor_qe: '',
        entered_semester_qe: '',
        academic_year_qe: '',
        date_advisor_qe: '',
        results_qe: '',
        entered_semester_passed_exam_qe: '',
        academic_year_passed_exam_qe: '',
        start_date_advisor_qe: '',
        end_date_advisor_qe: '',
        graduate_co_advisor: [
          {
            // advisor_co_type: '',
            // thesis_co_advisor_qe_th: '',
            // thesis_co_advisor_qe_en: '',
            // department_co_advisor_qe: '',
            // faculty_co_advisor_qe: '',
            // academic_ranks_co_advisor_qe_th: '',
            // academic_ranks_co_advisor_qe_en: '',
            // academic_rank_co_manager_qe: '',
            // affiliation_co_advisor_qe: '',
            // program_studyth_co_advisor_qe: '',
            // program_studyen_co_advisor_qe: '',
            // field_studyth_co_advisor_qe: '',
            // field_studyen_co_advisor_qe: '',
            // study_plans_co_advisor_qe: '',
          },
        ],
        graduate_member_advisor: [{ name_memberth_qe: '', name_memberen_qe: '' }],
      },
    });
  };
  const getData = async (id) => {
    try {
      const res = await axios.get(`/graduate-student/${id}`);
      console.log('res before set', res.data);
      resetData();
      const resData = res.data;
      if (resData) {
        console.log('SET DATA');
        setData(resData);
        console.log('resData =>', resData);
      }
      setDefData(res.data.graduate_defense);
      setDefExData(res.data.graduate_defense_examination);
      setPubData(res.data.graduate_published);
      setGradData(res.data.graduate_graduation);

      if (res.data.graduate_advisor) {
        setChecked((prevChecked) => {
          const newChecked = [];
          newChecked[20] = true;
          return newChecked;
        });
        console.log('graduate_advisor Checked', checked[20]);
      }
      if (res.data.person_th === '1') {
        setData((prevData) => ({
          ...prevData,
          person_th: 1,
        }));
      }
      if (res.data.foreign === '1') {
        setData((prevData) => ({
          ...prevData,
          foreign: 1,
        }));
      }
      if (res.data.education_certificate_bachelor_degrees == '1') {
        console.log('education_certificate_bachelor_degrees true');
        setData((prevData) => ({
          ...prevData,
          education_certificate_bachelor_degrees: 1,
        }));
        setChecked((prevState) => ({ ...prevState, 4: res.data.education_certificate_bachelor_degrees }));
      }
      if (res.data.education_certificate_master_degrees == '1') {
        setData((prevData) => ({
          ...prevData,
          education_certificate_master_degrees: 1,
        }));
        setChecked((prevState) => ({ ...prevState, 5: res.data.education_certificate_master_degrees }));
      }
      if (res.data.cu_tep != 0) {
        setScore(res.data.cu_tep);
        setChecked((prevState) => ({ ...prevState, 0: res.data.cu_tep }));
        if (
          res.data.cu_tep != 0 &&
          res.data.education_certificate_bachelor_degrees == '1' &&
          res.data.education_certificate_master_degrees != '1'
        ) {
          if (res.data.cu_tep >= 30 && res.data.cu_tep <= 37) {
            setAutoSeletor(true);
            setAutoSeletor2(false);
            data.cu_tep_pass = true;
          } else if (res.data.cu_tep >= 38 && res.data.cu_tep <= 44) {
            setAutoSeletor2(true);
            setAutoSeletor(false);
            data.cu_tep_pass = true;
          } else if (res.data.cu_tep >= 45) {
            setAutoSeletor(false);
            setAutoSeletor2(false);
            data.cu_tep_pass = true;
          } else if (res.data.cu_tep <= 29) {
            data.cu_tep_pass = false;
          }
        } else if (res.data.cu_tep != 0 && res.data.education_certificate_master_degrees == '1') {
          if (res.data.cu_tep >= 45 && res.data.cu_tep <= 59) {
            setAutoSeletorMaster1(true);
            setAutoSeletorMaster2(false);
            data.cu_tep_pass = true;
          } else if (res.data.cu_tep >= 60 && res.data.cu_tep <= 66) {
            setAutoSeletorMaster2(true);
            setAutoSeletorMaster1(false);
            data.cu_tep_pass = true;
          } else if (res.data.cu_tep >= 67) {
            setAutoSeletorMaster1(false);
            setAutoSeletorMaster2(false);
            data.cu_tep_pass = true;
          } else if (res.data.cu_tep <= 44) {
            data.cu_tep_pass = false;
          }
        }
      }
      if (res.data.toefl != 0) {
        setScoreTOEFL(res.data.toefl);
        setChecked((prevState) => ({ ...prevState, 2: res.data.toefl }));
        if (
          res.data.toefl != 0 &&
          res.data.education_certificate_bachelor_degrees == '1' &&
          res.data.education_certificate_master_degrees != '1'
        ) {
          if (res.data.toefl >= 400 && res.data.toefl <= 424) {
            setAutoSeletorTOEFL(true);
            setAutoSeletorTOEFL2(false);
            data.toefl_pass = true;
          } else if (res.data.toefl >= 425 && res.data.toefl <= 449) {
            setAutoSeletorTOEFL2(true);
            setAutoSeletorTOEFL(false);
            data.toefl_pass = true;
          } else if (res.data.toefl >= 450) {
            setAutoSeletorTOEFL(false);
            setAutoSeletorTOEFL2(false);
            data.toefl_pass = true;
          } else if (res.data.toefl <= 399) {
            data.toefl_pass = false;
          }
        } else if (
          res.data.toefl != 0 &&
          res.data.education_certificate_bachelor_degrees == '1' &&
          res.data.education_certificate_master_degrees == '1'
        ) {
          if (res.data.toefl >= 450 && res.data.toefl <= 499) {
            setAutoSeletorMastersTOEFL(true);
            setAutoSeletorMastersTOEFL2(false);
            data.toefl_pass = true;
          } else if (scores.data.toeflreTOEFL >= 500 && res.data.toefl <= 524) {
            setAutoSeletorMastersTOEFL2(true);
            setAutoSeletorMastersTOEFL(false);
            data.toefl_pass = true;
          } else if (res.data.toefl >= 525) {
            setAutoSeletorMastersTOEFL(false);
            setAutoSeletorMastersTOEFL2(false);
            data.toefl_pass = true;
          } else if (res.data.toefl <= 449) {
            data.toefl_pass = false;
          }
        }
      }
      if (res.data.ielts != 0) {
        setScoreIELTS(res.data.ielts);
        setChecked((prevState) => ({ ...prevState, 1: res.data.ielts }));
        if (
          res.data.ielts != 0 &&
          res.data.education_certificate_bachelor_degrees == '1' &&
          res.data.education_certificate_master_degrees != '1'
        ) {
          if (res.data.ielts >= 3.0 && res.data.ielts <= 3.4) {
            setAutoSeletorIELTS(true);
            setAutoSeletorIELTS2(false);
            data.ielts_pass = true;
          } else if (res.data.ielts >= 3.5 && res.data.ielts <= 3.9) {
            setAutoSeletorIELTS2(true);
            setAutoSeletorIELTS(false);
            data.ielts_pass = true;
          } else if (res.data.ielts >= 4) {
            setAutoSeletorIELTS(false);
            setAutoSeletorIELTS2(false);
            data.ielts_pass = true;
          } else if (res.data.ielts <= 2.9) {
            data.ielts_pass = false;
          }
        } else if (
          res.data.ielts != 0 &&
          res.data.education_certificate_bachelor_degrees == '1' &&
          res.data.education_certificate_master_degrees == '1'
        ) {
          if (res.data.ielts >= 4 && res.data.ielts <= 4.4) {
            setAutoSeletorMastersIELTS(true);
            setAutoSeletorMastersIELTS2(false);
            data.ielts_pass = true;
          } else if (res.data.ielts >= 4.5 && res.data.ielts <= 5.4) {
            setAutoSeletorMastersIELTS2(true);
            setAutoSeletorMastersIELTS(false);
            data.ielts_pass = true;
          } else if (res.data.ielts >= 5.5) {
            setAutoSeletorMastersIELTS(false);
            setAutoSeletorMastersIELTS2(false);
            data.ielts_pass = true;
          } else if (res.data.ielts <= 3.9) {
            data.ielts_pass = false;
          }
        }
      }

      if (!isEmpty(res.data.graduate_advisor)) {
        if (res.data.graduate_advisor.advisor_type === 'internal') {
          setSelecTeacher(0);
        } else if (res.data.graduate_advisor.advisor_type === 'external') {
          setSelecTeacher(1);
        }
      }
      if (!isEmpty(res.data.graduate_advisor.graduate_co_advisor)) {
        const updatedFetchDataCo = [...fetchDataCo, ...res.data.graduate_advisor.graduate_co_advisor];
        if (isEmpty(fetchDataCo)) {
          setFetchDataCo(updatedFetchDataCo);
        }
        console.log('fetchDataCo');
      }
      if (!isEmpty(res.data.graduate_advisor.graduate_member_advisor)) {
        const updatedFetchDataBacs = [...fetchDataCo, ...res.data.graduate_advisor.graduate_member_advisor];
        if (isEmpty(fetchDataBacs)) {
          setFetchDataBacs(updatedFetchDataBacs);
        }
      }

      if (!isEmpty(res.data.graduate_advisor)) {
        setData((prevData) => ({
          ...prevData,
          graduate_co_advisor: [
            {
              advisor_co_type: '',
              thesis_co_advisor_qe_th: '',
              thesis_co_advisor_qe_en: '',
              department_co_advisor_qe: '',
              faculty_co_advisor_qe: '',
              academic_ranks_co_advisor_qe_th: '',
              academic_ranks_co_advisor_qe_en: '',
              academic_rank_co_manager_qe: '',
              affiliation_co_advisor_qe: '',
              program_studyth_co_advisor_qe: '',
              program_studyen_co_advisor_qe: '',
              field_studyth_co_advisor_qe: '',
              field_studyen_co_advisor_qe: '',
              study_plans_co_advisor_qe: '',
            },
          ],
          graduate_member_advisor: [{ name_memberth_qe: '', name_memberen_qe: '' }],
        }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getLecturerList();

      if (dataForEdit) {
        setEditMode(true);
        await getData(dataForEdit);
      }
      setForceRender((prev) => !prev);
    };

    fetchData();
  }, [dataForEdit]);

  useEffect(() => {
    console.log('fetchDataCo =>', fetchDataCo);
    if (!isEmpty(data.graduate_advisor?.graduate_co_advisor)) {
      fetchDataCo.forEach((advisor, index) => {
        setSelectCoAdvisoreacher((prevState) => {
          const updatedSelectCoAdvisoreacher = [...prevState];
          updatedSelectCoAdvisoreacher[index] = { value: advisor.advisor_co_type === 'internal' ? '1' : '2' };
          return updatedSelectCoAdvisoreacher;
        });
      });
      setCoAdvisorFields(fetchDataCo);
      setForceRender((prev) => !prev);
    }
  }, [fetchDataCo]);

  useEffect(() => {
    console.log('fetchDataBacs =>', fetchDataBacs);
    if (!isEmpty(data.graduate_advisor?.graduate_member_advisor)) {
      setBacsFields(fetchDataBacs);
      setForceRender((prev) => !prev);
      console.log('bacsFields', bacsFields);
    }
  }, [fetchDataBacs]);

  useEffect(() => {
    console.log('data has been updated:', data);
  }, [data]);

  //-----------------------------------------------------------------------------
  return (
    <Box>
      <Stack>
        <Stack direction="column" useFlexGap spacing={3} sx={{ p: 6 }}>
          {/* DataMasterPageOne */}
          <Stack spacing={3}>
            <Typography variant="h5" color="#545454">
              ข้อมูลบัณฑิต
            </Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
              <FormControlLabel
                key="person_th"
                label="คนไทย"
                control={<Checkbox checked={data.person_th === 1} onChange={handleChangeNation('person_th')} />}
              />
              <FormControlLabel
                key="foreign"
                label="ต่างชาติ"
                control={<Checkbox checked={data.foreign === 1} onChange={handleChangeNation('foreign')} />}
              />
            </Stack>
            <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                  <TextField
                    disablePortal
                    sx={{ width: 860 }}
                    label="เลขประจำตัวนิสิต"
                    type="Number"
                    placeholder="ข้อความ"
                    name="student_id"
                    value={data.student_id}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                  <Autocomplete
                    disablePortal
                    sx={{ width: 420 }}
                    options={degreeOptions}
                    name="major_master_id"
                    value={editMode ? degreeOptions.find((option) => option.value === data.degree) : selectedDegree}
                    onChange={handleDegree}
                    renderInput={(params) => <TextField {...params} label="ระดับการศึกษา" />}
                  />
                  <Autocomplete
                    disablePortal
                    sx={{ width: 420 }}
                    // options={getMasterMajorOptions()}
                    options={MASTERS_MAJOR}
                    name="major_master_id"
                    disabled={editMode ? !data.major_master_id : !selectedDegree}
                    value={
                      editMode
                        ? MASTERS_MAJOR.find((option) => option.value === data.major_master_id)
                        : selectedMasterMajor
                    }
                    onChange={handleMasterMajor}
                    renderInput={(params) => <TextField {...params} label="สาขาวิชาเอก" />}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={MASTERS_NAMETITLESTH}
                    value={editMode ? data.nametites_th : selectedMasterNamePrefixTh}
                    onChange={handleMasterNamePrefixThChange}
                    sx={{ width: 420 }}
                    renderInput={(params) => <TextField {...params} label="คำนำหน้า (ภาษาไทย)" />}
                  />
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={MASTERS_NAMETITLESEN}
                    value={editMode ? data.nametites_en : selectedMasterNamePrefixEn}
                    onChange={handleMasterNamePrefixEnChange}
                    sx={{ width: 420 }}
                    renderInput={(params) => <TextField {...params} label="คำนำหน้า (อังกฤษ)" />}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                  <TextField
                    disablePortal
                    sx={{ width: 420 }}
                    label="ชื่อ (ภาษาไทย)"
                    placeholder="ข้อความ"
                    name="name_th"
                    value={data.name_th}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    disablePortal
                    sx={{ width: 420 }}
                    label="นามสกุล (ภาษาไทย)"
                    placeholder="ข้อความ"
                    name="lastname_th"
                    value={data.lastname_th}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                  <TextField
                    disablePortal
                    sx={{ width: 420 }}
                    label="ชื่อ (อังกฤษ)"
                    placeholder="ข้อความ"
                    name="name_en"
                    value={data.name_en}
                    // value={editMode ? data.masternameen : ''}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    disablePortal
                    sx={{ width: 420 }}
                    label="นามสกุล (อังกฤษ)"
                    placeholder="ข้อความ"
                    name="lastname_en"
                    value={data.lastname_en}
                    // value={editMode ? data.masterlastnameen : ''}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={MASTERS_STATUS}
                    //fullWidth
                    value={editMode ? data.student_status : selectedMasterStatus}
                    onChange={handleMasterStatusChange}
                    sx={{ width: 420 }}
                    renderInput={(params) => <TextField {...params} label="สถานะนิสิต" />}
                  />
                  <TextField
                    disablePortal
                    sx={{ width: 420 }}
                    label="E-mail นิสิต"
                    placeholder="ข้อความ"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={COUNTRY.map((option) => option.name)}
                    value={editMode ? data.country : selectedMasterCountry}
                    onChange={handleMasterCountryChange}
                    sx={{ width: 420 }}
                    renderInput={(params) => <TextField {...params} label="ประเทศ" />}
                  />

                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={MASTERS_STUDYPLAN}
                    disabled={editMode ? !data.studyplan : !selectedDegree}
                    value={editMode ? data.studyplan : selectedMasterStudyPlan}
                    onChange={handleMasterStudyPlan}
                    sx={{ width: 420 }}
                    renderInput={(params) => <TextField {...params} label="แผนการศึกษา" />}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={semesterOptions}
                    value={
                      editMode
                        ? semesterOptions.find((option) => option.value === data.semester)
                        : selectedMasterSemester
                    }
                    onChange={handleMasterSemester}
                    sx={{ width: 420 }}
                    renderInput={(params) => <TextField {...params} label="เข้าศึกษาภาคการศึกษา" />}
                  />
                  <TextField
                    disablePortal
                    sx={{ width: 420 }}
                    type="number"
                    label="ปีการศึกษาที่"
                    placeholder="ตัวเลข"
                    name="year_first_admission"
                    value={data.year_first_admission}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Stack>
              </Stack>
            </Stack>
            <Stack spacing={3}>
              <Typography variant="h5" color="#3B3B3B">
                ประวัติการศึกษา
              </Typography>
              <Stack>
                <FormControlLabel
                  label="ประวัติการศึกษาระดับปริญญาตรี"
                  name="workload_subtype"
                  control={<Checkbox checked={checked[4]} onChange={() => handleCheckedChange2(4)} />}
                />
              </Stack>
              {checked[4] && (
                <>
                  <Stack>
                    <TextField
                      disablePortal
                      sx={{ width: 860 }}
                      label="วุฒิปริญญาตรี"
                      placeholder="ข้อความ"
                      name="bachelor_degrees"
                      value={data.bachelor_degrees}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Stack>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                    <TextField
                      disablePortal
                      sx={{ width: 420 }}
                      label="คณะ"
                      placeholder="ข้อความ"
                      name="bachelor_faculty"
                      value={data.bachelor_faculty}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      disablePortal
                      sx={{ width: 420 }}
                      label="สาขาวิชาเอก"
                      placeholder="ข้อความ"
                      name="bachelor_major"
                      value={data.bachelor_major}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Stack>

                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                    <TextField
                      disablePortal
                      sx={{ width: 420 }}
                      label="มหาวิทยาลัย/สถาบันอุดมศึกษา"
                      placeholder="ข้อความ"
                      name="bachelor_university"
                      value={data.bachelor_university}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={COUNTRY.map((option) => option.name)}
                      value={editMode ? data.bachelor_country : selectedBachelorUniversityCountry}
                      onChange={handleBachelorUniversityCountry}
                      sx={{ width: 420 }}
                      renderInput={(params) => <TextField {...params} label="ประเทศ" />}
                    />
                  </Stack>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                    <TextField
                      disablePortal
                      sx={{ width: 420 }}
                      label="ปีที่สำเร็จการศึกษา"
                      placeholder="ข้อความ"
                      name="bachelor_year_completion"
                      type="number"
                      value={data.bachelor_year_completion}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      disablePortal
                      sx={{ width: 420 }}
                      label="แต้มเฉลี่ย"
                      placeholder="ข้อความ"
                      type="number"
                      name="bachelor_gpa"
                      value={data.bachelor_gpa}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Stack>
                </>
              )}
              <Stack>
                <FormControlLabel
                  label="ประวัติการศึกษาระดับปริญญาโท"
                  name="workload_subtype"
                  control={<Checkbox checked={checked[5]} onChange={() => handleCheckedChange2(5)} />}
                />
              </Stack>
              {checked[5] && (
                <>
                  <Stack>
                    <TextField
                      disablePortal
                      sx={{ width: 860 }}
                      label="วุฒิปริญญาโท"
                      placeholder="ข้อความ"
                      name="master_degrees"
                      value={data.master_degrees}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Stack>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                    <TextField
                      disablePortal
                      sx={{ width: 420 }}
                      label="คณะ"
                      placeholder="ข้อความ"
                      name="master_faculty"
                      value={data.master_faculty}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      disablePortal
                      sx={{ width: 420 }}
                      label="สาขาวิชาเอก"
                      placeholder="ข้อความ"
                      name="master_major"
                      value={data.master_major}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Stack>

                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                    <TextField
                      disablePortal
                      sx={{ width: 420 }}
                      label="มหาวิทยาลัย/สถาบันอุดมศึกษา"
                      placeholder="ข้อความ"
                      name="master_university"
                      value={data.master_university}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={COUNTRY.map((option) => option.name)}
                      value={editMode ? data.master_country : selectedMasterUniversityCountry}
                      onChange={handleMasterUniversityCountry}
                      sx={{ width: 420 }}
                      renderInput={(params) => <TextField {...params} label="ประเทศ" />}
                    />
                  </Stack>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                    <TextField
                      disablePortal
                      sx={{ width: 420 }}
                      label="ปีที่สำเร็จการศึกษา"
                      placeholder="ข้อความ"
                      name="master_year_completion"
                      type="number"
                      value={data.master_year_completion}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      disablePortal
                      sx={{ width: 420 }}
                      label="แต้มเฉลี่ย"
                      placeholder="ข้อความ"
                      type="number"
                      name="master_gpa"
                      value={data.master_gpa}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Stack>
                </>
              )}
              <Stack spacing={3}>
                <Typography variant="h5" color="#3B3B3B">
                  คะแนนภาษาอังกฤษ
                </Typography>
                <Stack>
                  <FormControlLabel
                    label="CU-TEP"
                    name="cu_tep"
                    control={<Checkbox checked={checked[0]} onChange={() => handleCheckedChange2(0)} />}
                  />
                </Stack>
                {checked[0] && (
                  <>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                      <TextField
                        disablePortal
                        sx={{ width: 420 }}
                        label="คะแนน"
                        type="Number"
                        placeholder="ตัวเลข"
                        value={score}
                        onChange={(event) => setScore(event.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                      <LoadingButton
                        style={{ borderRadius: '20px' }}
                        size="large"
                        loading={isFetch}
                        loadingPosition="start"
                        variant="contained"
                        onClick={() => verifyScore()}
                        sx={{ px: 8 }}
                      >
                        ตรวจสอบคะแนน
                      </LoadingButton>
                    </Stack>
                  </>
                )}
                {checked[0] && autoSeletor && !checked[5] && (
                  <>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        //ptions={subject}
                        disabled
                        sx={{ width: 420 }}
                        renderInput={(params) => (
                          <TextField {...params} label="5500 503 Preparatory English for Graduate Student" />
                        )}
                      />
                    </Stack>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={MASTERS_COURSE}
                      sx={{ width: 420 }}
                      value={editMode && data.subject2 ? data.subject2 : selectedSubject1}
                      onChange={handleSubject1}
                      renderInput={(params) => <TextField {...params} label="เลือกวิชา" />}
                    />
                  </>
                )}
                {checked[0] && autoSeletor2 && !checked[5] && (
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={MASTERS_COURSE}
                    sx={{ width: 420 }}
                    value={editMode && data.subject2 ? data.subject2 : selectedSubject2}
                    onChange={handleSubject2}
                    renderInput={(params) => <TextField {...params} label="เลือกวิชา" />}
                  />
                )}
                {checked[0] && autoSeletorMaster1 && checked[5] && (
                  <>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        //ptions={subject}
                        disabled
                        sx={{ width: 420 }}
                        renderInput={(params) => (
                          <TextField {...params} label="5500 532 Academic English for Graduate Studies" />
                        )}
                      />
                    </Stack>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      //ptions={subject}
                      disabled
                      sx={{ width: 420 }}
                      renderInput={(params) => <TextField {...params} label="5500 560 Thesis Writing" />}
                    />
                  </>
                )}
                {checked[0] && autoSeletorMaster2 && checked[5] && (
                  <>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        //ptions={subject}
                        disabled
                        sx={{ width: 420 }}
                        renderInput={(params) => <TextField {...params} label="5500 560 Thesis Writing" />}
                      />
                    </Stack>
                  </>
                )}
                <Stack>
                  <FormControlLabel
                    label="TOEFL"
                    name="workload_subtype"
                    control={<Checkbox checked={checked[2]} onChange={() => handleCheckedChange2(2)} />}
                  />
                </Stack>
                {checked[2] && (
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                    <TextField
                      disablePortal
                      sx={{ width: 420 }}
                      label="คะแนน"
                      type="text"
                      value={scoreTOEFL}
                      onChange={(event) => setScoreTOEFL(event.target.value)}
                      placeholder="ตัวเลข"
                      InputLabelProps={{ shrink: true }}
                    />
                    <LoadingButton
                      style={{ borderRadius: '20px' }}
                      size="large"
                      loading={isFetch}
                      loadingPosition="start"
                      variant="contained"
                      onClick={() => verifyScoreTOEFL()}
                      sx={{ px: 8 }}
                    >
                      ตรวจสอบคะแนน
                    </LoadingButton>
                  </Stack>
                )}
                {checked[2] && autoSeletorTOEFL && !checked[5] && (
                  <>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        //ptions={subject}
                        disabled
                        sx={{ width: 420 }}
                        renderInput={(params) => (
                          <TextField {...params} label="5500 503 Preparatory English for Graduate Student" />
                        )}
                      />
                    </Stack>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={MASTERS_COURSE}
                      value={editMode && data.subject2 ? data.subject2 : selectedSubject3}
                      onChange={handleSubject3}
                      sx={{ width: 420 }}
                      renderInput={(params) => <TextField {...params} label="เลือกวิชา" />}
                    />
                  </>
                )}
                {checked[2] && autoSeletorTOEFL2 && !checked[5] && (
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={MASTERS_COURSE}
                    sx={{ width: 420 }}
                    value={editMode && data.subject2 ? data.subject2 : selectedSubject4}
                    onChange={handleSubject4}
                    renderInput={(params) => <TextField {...params} label="เลือกวิชา" />}
                  />
                )}
                {checked[2] && autoSeletorMastersTOEFL && checked[5] && (
                  <>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        //ptions={subject}
                        disabled
                        sx={{ width: 420 }}
                        renderInput={(params) => (
                          <TextField {...params} label="5500 532 Academic English for Graduate Studies" />
                        )}
                      />
                    </Stack>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      //ptions={subject}
                      disabled
                      sx={{ width: 420 }}
                      renderInput={(params) => <TextField {...params} label="5500 560 Thesis Writing" />}
                    />
                  </>
                )}
                {checked[2] && autoSeletorMastersTOEFL2 && checked[5] && (
                  <>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        //ptions={subject}
                        disabled
                        sx={{ width: 420 }}
                        renderInput={(params) => <TextField {...params} label="5500 560 Thesis Writing" />}
                      />
                    </Stack>
                  </>
                )}
                <Stack>
                  <FormControlLabel
                    label="IELTS"
                    name="workload_subtype"
                    control={<Checkbox checked={checked[1]} onChange={() => handleCheckedChange2(1)} />}
                  />
                </Stack>
                {checked[1] && (
                  <>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                      <TextField
                        disablePortal
                        sx={{ width: 420 }}
                        label="คะแนน"
                        type="Number"
                        value={scoreIELTS}
                        onChange={(event) => setScoreIELTS(event.target.value)}
                        placeholder="ตัวเลข"
                        InputLabelProps={{ shrink: true }}
                      />
                      <LoadingButton
                        style={{ borderRadius: '20px' }}
                        size="large"
                        loading={isFetch}
                        loadingPosition="start"
                        variant="contained"
                        onClick={() => verifyScoreIELTS()}
                        sx={{ px: 8 }}
                      >
                        ตรวจสอบคะแนน
                      </LoadingButton>
                    </Stack>
                  </>
                )}
                {checked[1] && autoSeletorIELTS && !checked[5] && (
                  <>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        //ptions={subject}
                        disabled
                        sx={{ width: 420 }}
                        renderInput={(params) => (
                          <TextField {...params} label="5500 503 Preparatory English for Graduate Student" />
                        )}
                      />
                    </Stack>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={MASTERS_COURSE}
                      sx={{ width: 420 }}
                      value={editMode && data.subject2 ? data.subject2 : selectedSubject5}
                      onChange={handleSubject5}
                      renderInput={(params) => <TextField {...params} label="เลือกวิชา" />}
                    />
                  </>
                )}
                {checked[1] && autoSeletorIELTS2 && !checked[5] && (
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={MASTERS_COURSE}
                    sx={{ width: 420 }}
                    value={editMode && data.subject2 ? data.subject2 : selectedSubject6}
                    onChange={handleSubject6}
                    renderInput={(params) => <TextField {...params} label="เลือกวิชา" />}
                  />
                )}
                {checked[1] && autoSeletorMastersIELTS && checked[5] && (
                  <>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        //ptions={subject}
                        disabled
                        sx={{ width: 420 }}
                        renderInput={(params) => (
                          <TextField {...params} label="5500 532 Academic English for Graduate Studies" />
                        )}
                      />
                    </Stack>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      //ptions={subject}
                      disabled
                      sx={{ width: 420 }}
                      renderInput={(params) => <TextField {...params} label="5500 560 Thesis Writing" />}
                    />
                  </>
                )}
                {checked[1] && autoSeletorMastersIELTS2 && checked[5] && (
                  <>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        //ptions={subject}
                        disabled
                        sx={{ width: 420 }}
                        renderInput={(params) => <TextField {...params} label="5500 560 Thesis Writing" />}
                      />
                    </Stack>
                  </>
                )}
              </Stack>
              <Stack spacing={3}>
                <Typography variant="h5" color="#3B3B3B">
                  สถานที่ทำงานปัจจุบัน
                </Typography>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                  <TextField
                    disablePortal
                    sx={{ width: 420 }}
                    label="สถานที่ทำงาน"
                    placeholder="ข้อความ"
                    name="office"
                    value={data.office}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    disablePortal
                    sx={{ width: 420 }}
                    label="ตำแหน่ง"
                    placeholder="ข้อความ"
                    name="position"
                    value={data.position}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Stack>
              </Stack>
              <Typography variant="h5" color="#3B3B3B">
                หัวข้อการสอบ
              </Typography>
              <Stack>
                <Stack>
                  <FormControlLabel
                    label="สอบ QE"
                    control={<Checkbox checked={checked[20]} onChange={() => handleCheckedChange2(20)} />}
                  />
                </Stack>
                <Stack spacing={3}>
                  {checked[20] && (
                    <>
                      <Stack spacing={3} sx={{ pl: 6 }}>
                        <Typography variant="h5" color="#3B3B3B">
                          ข้อมูลอาจารย์ที่ปรึกษา
                        </Typography>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                          {teacherOptions.map((option, i) => (
                            <FormControlLabel
                              key={option.index}
                              label={option.label}
                              name="workload_subtype"
                              control={<Checkbox checked={i === selectTeacher} onChange={() => onChangeTeacher(i)} />}
                            />
                          ))}
                        </Stack>
                      </Stack>

                      {selectTeacher == 0 && (
                        <>
                          <Stack spacing={3} sx={{ pl: 6 }}>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                              <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={lecturerNames}
                                sx={{ width: 420 }}
                                freeSolo
                                value={editMode ? data.graduate_advisor.thesis_advisor_qe_th : selectedLecturerNames}
                                onChange={handleChangeAdvisorName}
                                renderInput={(params) => (
                                  <TextField {...params} label="ชื่ออาจาร์ยที่ปรึกษา (ภาษาไทย)" />
                                )}
                              />
                              <TextField
                                disablePortal
                                sx={{ width: 420 }}
                                label="ชื่ออาจาร์ยที่ปรึกษา (อังกฤษ)"
                                placeholder="ข้อความ"
                                name="thesis_advisor_qe_en"
                                value={data.graduate_advisor.thesis_advisor_qe_en}
                                onChange={handleChangeAdvisor}
                                InputLabelProps={{ shrink: true }}
                              />
                            </Stack>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                              <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={MASTERS_ACADEMICTH}
                                sx={{ width: 420 }}
                                value={
                                  editMode
                                    ? data.graduate_advisor.academic_ranks_advisor_qe_th
                                    : selectedAcademicRanksAdviserTh
                                }
                                onChange={handleAcademicRanksAdviserTh}
                                renderInput={(params) => <TextField {...params} label="ตำแหน่งทางวิชาการ (ภาษาไทย)" />}
                              />
                              <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={MASTERS_ACADEMICEN}
                                sx={{ width: 420 }}
                                value={
                                  editMode
                                    ? data.graduate_advisor.academic_ranks_advisor_qe_en
                                    : selectedAcademicRanksAdviserEn
                                }
                                onChange={handleAcademicRanksAdviserEn}
                                renderInput={(params) => <TextField {...params} label="ตำแหน่งทางวิชาการ (อังกฤษ)" />}
                              />
                            </Stack>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                              <TextField
                                disablePortal
                                sx={{ width: 860 }}
                                label="รหัสประจำตัวอาจารย์ที่ปรึกษา"
                                placeholder="ข้อความ"
                                name="lecturer_number"
                                value={data.graduate_advisor.lecturer_number}
                                onChange={handleChangeAdvisor}
                                InputLabelProps={{ shrink: true }}
                              />
                            </Stack>

                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                              <TextField
                                disablePortal
                                sx={{ width: 420 }}
                                label="ภาควิชา"
                                placeholder="ข้อความ"
                                name="department_advisor_qe"
                                value={data.graduate_advisor.department_advisor_qe}
                                onChange={handleChangeAdvisor}
                                InputLabelProps={{ shrink: true }}
                              />
                              <TextField
                                disablePortal
                                sx={{ width: 420 }}
                                label="คณะ"
                                placeholder="ข้อความ"
                                name="faculty_advisor_qe"
                                defaultValue="คณะเภสัชศาสตร์"
                                value={data.graduate_advisor.faculty_advisor_qe}
                                onChange={handleChangeAdvisor}
                                InputLabelProps={{ shrink: true }}
                              />
                            </Stack>
                          </Stack>
                        </>
                      )}
                      {selectTeacher == 1 && (
                        <>
                          <Stack spacing={3} sx={{ pl: 6 }}>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                              <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={lecturerNames}
                                sx={{ width: 420 }}
                                freeSolo
                                value={editMode ? data.graduate_advisor.thesis_advisor_qe_th : selectedLecturerNames}
                                onChange={handleChangeAdvisorName}
                                renderInput={(params) => (
                                  <TextField {...params} label="ชื่ออาจาร์ยที่ปรึกษา (ภาษาไทย)" />
                                )}
                              />
                              <TextField
                                disablePortal
                                sx={{ width: 420 }}
                                label="ชื่ออาจาร์ยที่ปรึกษา (อังกฤษ)"
                                placeholder="ข้อความ"
                                name="thesis_advisor_qe_en"
                                value={data.graduate_advisor.thesis_advisor_qe_en}
                                onChange={handleChangeAdvisor}
                                InputLabelProps={{ shrink: true }}
                              />
                            </Stack>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                              <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={MASTERS_ACADEMICTH}
                                sx={{ width: 420 }}
                                value={
                                  editMode
                                    ? data.graduate_advisor.academic_ranks_advisor_qe_th
                                    : selectedAcademicRanksAdviserTh
                                }
                                onChange={handleAcademicRanksAdviserTh}
                                renderInput={(params) => <TextField {...params} label="ตำแหน่งทางวิชาการ (ภาษาไทย)" />}
                              />
                              <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={MASTERS_ACADEMICEN}
                                sx={{ width: 420 }}
                                value={
                                  editMode
                                    ? data.graduate_advisor.academic_ranks_advisor_qe_en
                                    : selectedAcademicRanksAdviserEn
                                }
                                onChange={handleAcademicRanksAdviserEn}
                                renderInput={(params) => <TextField {...params} label="ตำแหน่งทางวิชาการ (อังกฤษ)" />}
                              />
                            </Stack>
                            {/* <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                              <TextField
                                disablePortal
                                sx={{ width: 860 }}
                                label="รหัสประจำตัว อาจารย์"
                                placeholder="ข้อความ"
                                name="lecturer_number"
                                value={data.graduate_advisor.lecturer_number}
                                onChange={handleChangeAdvisor}
                                InputLabelProps={{ shrink: true }}
                              />
                            </Stack> */}
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                              <TextField
                                disablePortal
                                sx={{ width: 420 }}
                                label="ภาควิชา"
                                placeholder="ข้อความ"
                                name="department_advisor_qe"
                                value={data.graduate_advisor.department_advisor_qe}
                                onChange={handleChangeAdvisor}
                                InputLabelProps={{ shrink: true }}
                              />
                              <TextField
                                disablePortal
                                sx={{ width: 420 }}
                                label="คณะ"
                                placeholder="ข้อความ"
                                name="faculty_advisor_qe"
                                value={data.graduate_advisor.faculty_advisor_qe}
                                onChange={handleChangeAdvisor}
                                InputLabelProps={{ shrink: true }}
                              />
                            </Stack>

                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                              <TextField
                                disablePortal
                                sx={{ width: 420 }}
                                label="ตำแหน่งผู้บังคับบัญชา "
                                placeholder="ข้อความ"
                                name="academic_rank_manager_qe"
                                value={data.graduate_advisor.academic_rank_manager_qe}
                                onChange={handleChangeAdvisor}
                                InputLabelProps={{ shrink: true }}
                              />
                              <TextField
                                disablePortal
                                sx={{ width: 420 }}
                                label="สังกัด"
                                placeholder="ข้อความ"
                                name="affiliation_advisor_qe"
                                value={data.graduate_advisor.affiliation_advisor_qe}
                                onChange={handleChangeAdvisor}
                                InputLabelProps={{ shrink: true }}
                              />
                            </Stack>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                              <TextField
                                disablePortal
                                sx={{ width: 420 }}
                                label="หลักสูตร (ภาษาไทย) "
                                placeholder="ข้อความ"
                                name="program_studyth_advisor_qe"
                                value={data.graduate_advisor.program_studyth_advisor_qe}
                                onChange={handleChangeAdvisor}
                                InputLabelProps={{ shrink: true }}
                              />
                              <TextField
                                disablePortal
                                sx={{ width: 420 }}
                                label="หลักสูตร (อังกฤษ)"
                                placeholder="ข้อความ"
                                name="program_studyen_advisor_qe"
                                value={data.graduate_advisor.program_studyen_advisor_qe}
                                onChange={handleChangeAdvisor}
                                InputLabelProps={{ shrink: true }}
                              />
                            </Stack>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                              <TextField
                                disablePortal
                                sx={{ width: 420 }}
                                label="สาขาวิชา (ภาษาไทย) "
                                placeholder="ข้อความ"
                                name="field_studyth_advisor_qe"
                                value={data.graduate_advisor.field_studyth_advisor_qe}
                                onChange={handleChangeAdvisor}
                                InputLabelProps={{ shrink: true }}
                              />
                              <TextField
                                disablePortal
                                sx={{ width: 420 }}
                                label="สาขาวิชา (อังกฤษ) "
                                placeholder="ข้อความ"
                                name="field_studyen_advisor_qe"
                                value={data.graduate_advisor.field_studyen_advisor_qe}
                                onChange={handleChangeAdvisor}
                                InputLabelProps={{ shrink: true }}
                              />
                            </Stack>
                            {/* <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                              <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={MASTERS_STUDYPLAN}
                                sx={{ width: 860 }}
                                value={
                                  editMode ? data.graduate_advisor.study_plans_advisor_qe : selectedStudyPlansAdvisorQe
                                }
                                onChange={handleStudyPlansAdvisorQe}
                                renderInput={(params) => <TextField {...params} label="แผนการศึกษา" />}
                              />
                            </Stack> */}
                          </Stack>
                        </>
                      )}
                    </>
                  )}
                  {checked[20] && (
                    <Stack spacing={3} sx={{ pl: 6 }}>
                      <Typography variant="h5" color="#3B3B3B">
                        ข้อมูลอาจารย์ที่ปรึกษาร่วม
                      </Typography>
                    </Stack>
                  )}
                  {coAdvisorFields.map((field, index) => (
                    <Stack key={index}>
                      {checked[20] && (
                        <Stack spacing={3} sx={{ pl: 6 }}>
                          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1, pb: 3 }}>
                            {co_advisorOptions.map((option, i) => (
                              <FormControlLabel
                                key={option.i}
                                label={option.label}
                                name="graduate_co_advisor"
                                control={
                                  <Checkbox
                                    value={option.value}
                                    checked={selectCoAdvisoreacher[index]?.value === option.value}
                                    onChange={() => onChangeCo_advisor(index, option.value)}
                                  />
                                }
                              />
                            ))}
                          </Stack>
                        </Stack>
                      )}
                      {checked[20] && selectCoAdvisoreacher[index]?.value == 1 && (
                        <Stack spacing={3} sx={{ pl: 6 }}>
                          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                            <TextField
                              disablePortal
                              sx={{ width: 420 }}
                              label="ชื่ออาจาร์ยที่ปรึกษาร่วม (ภาษาไทย)"
                              placeholder="ข้อความ"
                              name={`graduate_co_advisor.${index}.thesis_co_advisor_qe_th`}
                              defaultValue={field.thesis_co_advisor_qe_th}
                              onChange={(e) => handleCoAdvisorChange(index, 'thesis_co_advisor_qe_th', e.target.value)}
                              InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                              disablePortal
                              sx={{ width: 420 }}
                              label="ชื่ออาจาร์ยที่ปรึกษาร่วม (อังกฤษ)"
                              name={`graduate_co_advisor.${index}.thesis_co_advisor_qe_en`}
                              defaultValue={field.thesis_co_advisor_qe_en}
                              onChange={(e) => handleCoAdvisorChange(index, 'thesis_co_advisor_qe_en', e.target.value)}
                              placeholder="ข้อความ"
                              InputLabelProps={{ shrink: true }}
                            />
                          </Stack>
                          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={MASTERS_ACADEMICTH}
                              sx={{ width: 420 }}
                              name={`graduate_co_advisor.${index}.academic_ranks_co_advisor_qe_th`}
                              defaultValue={field.academic_ranks_co_advisor_qe_th}
                              onChange={(e, newValue) =>
                                handleCoAdvisorChange(index, 'academic_ranks_co_advisor_qe_th', newValue)
                              }
                              renderInput={(params) => <TextField {...params} label="ตำแหน่งทางวิชาการ (ภาษาไทย)" />}
                            />
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={MASTERS_ACADEMICEN}
                              sx={{ width: 420 }}
                              name={`graduate_co_advisor.${index}.academic_ranks_co_advisor_qe_en`}
                              defaultValue={field.academic_ranks_co_advisor_qe_en}
                              onChange={(e, newValue) =>
                                handleCoAdvisorChange(index, 'academic_ranks_co_advisor_qe_en', newValue)
                              }
                              renderInput={(params) => <TextField {...params} label="ตำแหน่งทางวิชาการ (อังกฤษ)" />}
                            />
                          </Stack>
                          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                            <TextField
                              disablePortal
                              sx={{ width: 420 }}
                              label="ภาควิชา"
                              name={`graduate_co_advisor.${index}.department_co_advisor_qe`}
                              defaultValue={field.department_co_advisor_qe}
                              onChange={(e) => handleCoAdvisorChange(index, 'department_co_advisor_qe', e.target.value)}
                              placeholder="ข้อความ"
                              InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                              disablePortal
                              sx={{ width: 420 }}
                              label="คณะ"
                              name={`graduate_co_advisor.${index}.faculty_co_advisor_qe`}
                              defaultValue={field.faculty_co_advisor_qe}
                              onChange={(e) => handleCoAdvisorChange(index, 'faculty_co_advisor_qe', e.target.value)}
                              placeholder="ข้อความ"
                              InputLabelProps={{ shrink: true }}
                            />
                          </Stack>
                        </Stack>
                      )}
                      {checked[20] && selectCoAdvisoreacher[index]?.value == 2 && (
                        <Stack spacing={3} sx={{ pl: 6 }}>
                          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                            <TextField
                              disablePortal
                              sx={{ width: 420 }}
                              label="ชื่ออาจาร์ยที่ปรึกษาร่วม (ภาษาไทย)"
                              placeholder="ข้อความ"
                              name={`graduate_co_advisor.${index}.thesis_co_advisor_qe_th`}
                              control={control}
                              defaultValue={field.thesis_co_advisor_qe_th}
                              onChange={(e) => handleCoAdvisorChange(index, 'thesis_co_advisor_qe_th', e.target.value)}
                              InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                              disablePortal
                              sx={{ width: 420 }}
                              label="ชื่ออาจาร์ยที่ปรึกษาร่วม (อังกฤษ)"
                              placeholder="ข้อความ"
                              name={`graduate_co_advisor.${index}.thesis_co_advisor_qe_en`}
                              defaultValue={field.thesis_co_advisor_qe_en}
                              onChange={(e) => handleCoAdvisorChange(index, 'thesis_co_advisor_qe_en', e.target.value)}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Stack>
                          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={MASTERS_ACADEMICTH}
                              sx={{ width: 420 }}
                              name={`graduate_co_advisor.${index}.academic_ranks_co_advisor_qe_th`}
                              defaultValue={field.academic_ranks_co_advisor_qe_th}
                              onChange={(e, newValue) =>
                                handleCoAdvisorChange(index, 'academic_ranks_co_advisor_qe_th', newValue)
                              }
                              renderInput={(params) => <TextField {...params} label="ตำแหน่งทางวิชาการ (ภาษาไทย)" />}
                            />
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={MASTERS_ACADEMICEN}
                              sx={{ width: 420 }}
                              name={`graduate_co_advisor.${index}.academic_ranks_co_advisor_qe_en`}
                              defaultValue={field.academic_ranks_co_advisor_qe_en}
                              onChange={(e, newValue) =>
                                handleCoAdvisorChange(index, 'academic_ranks_co_advisor_qe_en', newValue)
                              }
                              renderInput={(params) => <TextField {...params} label="ตำแหน่งทางวิชาการ (อังกฤษ)" />}
                            />
                          </Stack>
                          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                            <TextField
                              disablePortal
                              sx={{ width: 420 }}
                              label="ภาควิชา"
                              placeholder="ข้อความ"
                              name={`graduate_co_advisor.${index}.department_co_advisor_qe`}
                              defaultValue={field.department_co_advisor_qe}
                              onChange={(e) => handleCoAdvisorChange(index, 'department_co_advisor_qe', e.target.value)}
                              InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                              disablePortal
                              sx={{ width: 420 }}
                              label="คณะ"
                              placeholder="ข้อความ"
                              name={`graduate_co_advisor.${index}.faculty_co_advisor_qe`}
                              defaultValue={field.faculty_co_advisor_qe}
                              onChange={(e) => handleCoAdvisorChange(index, 'faculty_co_advisor_qe', e.target.value)}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Stack>

                          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                            <TextField
                              disablePortal
                              sx={{ width: 420 }}
                              label="ตำแหน่งผู้บังคับบัญชา "
                              placeholder="ข้อความ"
                              name={`graduate_co_advisor.${index}.academic_rank_co_manager_qe`}
                              defaultValue={field.academic_rank_co_manager_qe}
                              onChange={(e) =>
                                handleCoAdvisorChange(index, 'academic_rank_co_manager_qe', e.target.value)
                              }
                              InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                              disablePortal
                              sx={{ width: 420 }}
                              label="สังกัด"
                              placeholder="ข้อความ"
                              name={`graduate_co_advisor.${index}.affiliation_co_advisor_qe`}
                              defaultValue={field.affiliation_co_advisor_qe}
                              onChange={(e) =>
                                handleCoAdvisorChange(index, 'affiliation_co_advisor_qe', e.target.value)
                              }
                              InputLabelProps={{ shrink: true }}
                            />
                          </Stack>
                          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                            <TextField
                              disablePortal
                              sx={{ width: 420 }}
                              label="หลักสูตร (ภาษาไทย) "
                              placeholder="ข้อความ"
                              name={`graduate_co_advisor.${index}.program_studyth_co_advisor_qe`}
                              defaultValue={field.program_studyth_co_advisor_qe}
                              onChange={(e) =>
                                handleCoAdvisorChange(index, 'program_studyth_co_advisor_qe', e.target.value)
                              }
                              InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                              disablePortal
                              sx={{ width: 420 }}
                              label="หลักสูตร (อังกฤษ)"
                              placeholder="ข้อความ"
                              name={`graduate_co_advisor.${index}.program_studyen_co_advisor_qe`}
                              defaultValue={field.program_studyen_co_advisor_qe}
                              onChange={(e) =>
                                handleCoAdvisorChange(index, 'program_studyen_co_advisor_qe', e.target.value)
                              }
                              InputLabelProps={{ shrink: true }}
                            />
                          </Stack>
                          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                            <TextField
                              disablePortal
                              sx={{ width: 420 }}
                              label="สาขาวิชา (ภาษาไทย) "
                              placeholder="ข้อความ"
                              name={`graduate_co_advisor.${index}.field_studyth_co_advisor_qe`}
                              defaultValue={field.field_studyth_co_advisor_qe}
                              onChange={(e) =>
                                handleCoAdvisorChange(index, 'field_studyth_co_advisor_qe', e.target.value)
                              }
                              InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                              disablePortal
                              sx={{ width: 420 }}
                              label="สาขาวิชา (อังกฤษ) "
                              placeholder="ข้อความ"
                              name={`graduate_co_advisor.${index}.field_studyen_co_advisor_qe`}
                              defaultValue={field.field_studyen_co_advisor_qe}
                              onChange={(e) =>
                                handleCoAdvisorChange(index, 'field_studyen_co_advisor_qe', e.target.value)
                              }
                              InputLabelProps={{ shrink: true }}
                            />
                          </Stack>
                          {/* <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={MASTERS_STUDYPLAN}
                              sx={{ width: 860 }}
                              name={`graduate_co_advisor.${index}.study_plans_co_advisor_qe`}
                              defaultValue={field.study_plans_co_advisor_qe}
                              onChange={(e, newValue) =>
                                handleCoAdvisorChange(index, 'study_plans_co_advisor_qe', newValue)
                              }
                              renderInput={(params) => <TextField {...params} label="แผนการศึกษา" />}
                            />
                          </Stack> */}
                        </Stack>
                      )}
                      {checked[20] && (
                        <Stack spacing={3} sx={{ pl: 6 }}>
                          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1, pt: 1 }}>
                            <Button
                              size="small"
                              color="error"
                              startIcon={<Iconify icon="ic:outline-minus" />}
                              onClick={() => removeField(index)}
                              sx={{ flexShrink: 0 }}
                            >
                              ลบออก
                            </Button>
                          </Stack>
                        </Stack>
                      )}
                    </Stack>
                  ))}

                  {checked[20] && (
                    <Stack spacing={3} sx={{ pl: 6 }}>
                      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                        <Button size="small" startIcon={<Iconify icon="eva:plus-fill" />} onClick={addField}>
                          เพิ่มอาจารย์ที่ปรึกษาร่วม
                        </Button>
                      </Stack>
                    </Stack>
                  )}

                  {checked[20] && (
                    <>
                      <Stack spacing={3}>
                        <Stack spacing={3} sx={{ pl: 6 }}>
                          <Typography variant="h5" color="#3B3B3B">
                            ภาคการศึกษา
                          </Typography>
                          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={semesterOptions}
                              sx={{ width: 420 }}
                              value={
                                editMode && data.graduate_advisor?.entered_semester_qe !== null
                                  ? semesterOptions.find(
                                      (option) => option.value === data.graduate_advisor?.entered_semester_qe
                                    )
                                  : selectedEnteredSemesterQe
                              }
                              onChange={handleEnteredSemesterQe}
                              renderInput={(params) => <TextField {...params} label="ภาคการศึกษาที่สอบ " />}
                            />
                            <TextField
                              disablePortal
                              sx={{ width: 420 }}
                              label="ปีการศึกษาที่สอบ"
                              placeholder="ข้อความ"
                              name="academic_year_qe"
                              value={data.graduate_advisor?.academic_year_qe}
                              onChange={handleChangeAdvisor}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Stack>
                        </Stack>
                        <Stack spacing={3}>
                          <Stack spacing={3} sx={{ pl: 6 }}>
                            <Typography variant="h5" color="#3B3B3B">
                              ประธานกรรมการสอบ QE
                            </Typography>
                          </Stack>
                          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1, pl: 6 }}>
                            <TextField
                              sx={{ width: 420 }}
                              label="ชื่อประธานกรรมการสอบ QE (ภาษาไทย)"
                              placeholder="ข้อความ"
                              name={`name_chairpersonth_qe`}
                              defaultValue={data.graduate_advisor.name_chairpersonth_qe}
                              onChange={handleChangeAdvisor}
                              InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                              sx={{ width: 420 }}
                              label="ชื่อประธานกรรมการสอบ QE (อังกฤษ)"
                              placeholder="ข้อความ"
                              name={`name_chairpersonen_qe`}
                              defaultValue={data.graduate_advisor.name_chairpersonen_qe}
                              onChange={handleChangeAdvisor}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Stack>
                          <Stack spacing={3} sx={{ pl: 6 }}>
                            <Typography variant="h5" color="#3B3B3B">
                              กรรมการสอบ QE
                            </Typography>
                          </Stack>
                          {bacsFields.map((field, index) => (
                            <div key={field.id}>
                              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1, pl: 6 }}>
                                <TextField
                                  name={`field.name_memberth_qe`}
                                  sx={{ width: 420 }}
                                  label="ชื่อกรรมการสอบ QE (ภาษาไทย)"
                                  placeholder="ข้อความ"
                                  name={`graduate_member_advisor.${index}.name_memberth_qe`}
                                  defaultValue={field.name_memberth_qe}
                                  onChange={(e) => handleArrayChange(index, 'name_memberth_qe', e.target.value)}
                                  InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                  name={`field.name_memberen_qe}`}
                                  sx={{ width: 420 }}
                                  label="ชื่อกรรมการสอบ QE (อังกฤษ)"
                                  placeholder="ข้อความ"
                                  name={`graduate_member_advisor.${index}.name_memberen_qe`}
                                  defaultValue={field.name_memberen_qe}
                                  onChange={(e) => handleArrayChange(index, 'name_memberen_qe', e.target.value)}
                                  InputLabelProps={{ shrink: true }}
                                />
                                <Button size="small" color="error" onClick={() => removeBacsField(index)}>
                                  ลบออก
                                </Button>
                              </Stack>
                            </div>
                          ))}

                          <Stack spacing={2} sx={{ width: 1, pl: 6 }}>
                            <Button
                              size="small"
                              startIcon={<Iconify icon="eva:plus-fill" />}
                              onClick={addBacsField}
                              sx={{ width: 860 }}
                            >
                              เพิ่มกรรมการสอบ QE
                            </Button>
                          </Stack>

                          <Stack spacing={3} sx={{ pl: 6 }}>
                            <Typography variant="h5" color="#3B3B3B">
                              การสอบ QE ครั้ง 1
                            </Typography>
                          </Stack>
                          <Stack spacing={3}>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1, pl: 6 }}>
                              <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={MASTERS_STUDYQE}
                                sx={{ width: 860 }}
                                value={editMode ? data.graduate_advisor?.results_qe : selectedResultsQe}
                                onChange={handleResultsQe}
                                renderInput={(params) => <TextField {...params} label="ผลการศึกษา " />}
                              />
                            </Stack>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1, pl: 6 }}>
                              <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={MASTERS_SEMESTER}
                                sx={{ width: 420 }}
                                value={
                                  editMode
                                    ? data.graduate_advisor?.entered_semester_passed_exam_qe
                                    : selectedEnteredSemesterPassedExamQe
                                }
                                onChange={handleEnteredSemesterPassedExamQe}
                                renderInput={(params) => <TextField {...params} label="ภาคการศึกษาที่สอบ QE" />}
                              />
                              <TextField
                                disablePortal
                                sx={{ width: 420 }}
                                label="ปีการศึกษาที่ต้องสอบผ่าน"
                                placeholder="ข้อความ"
                                name="academic_year_passed_exam_qe"
                                value={
                                  data.graduate_advisor ? data.graduate_advisor?.academic_year_passed_exam_qe : null
                                }
                                onChange={handleChangeAdvisor}
                                InputLabelProps={{ shrink: true }}
                              />
                            </Stack>
                          </Stack>
                          <Stack spacing={3} sx={{ pl: 6 }}>
                            <Typography variant="h5" color="#3B3B3B">
                              การสอบ QE ครั้ง 2
                            </Typography>
                          </Stack>
                          <Stack spacing={3}>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1, pl: 6 }}>
                              <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={MASTERS_STUDYQE}
                                sx={{ width: 860 }}
                                value={editMode ? data.graduate_advisor?.results_qe2 : selectedResultsQe2}
                                onChange={handleResultsQe2}
                                renderInput={(params) => <TextField {...params} label="ผลการศึกษา " />}
                              />
                            </Stack>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1, pl: 6 }}>
                              <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={MASTERS_SEMESTER}
                                sx={{ width: 420 }}
                                value={
                                  editMode
                                    ? data.graduate_advisor?.entered_semester_passed_exam_qe2
                                    : selectedEnteredSemesterPassedExamQe2
                                }
                                onChange={handleEnteredSemesterPassedExamQe2}
                                renderInput={(params) => <TextField {...params} label="ภาคการศึกษาที่สอบ QE" />}
                              />
                              <TextField
                                disablePortal
                                sx={{ width: 420 }}
                                label="ปีการศึกษาที่ต้องสอบผ่าน"
                                placeholder="ข้อความ"
                                name="academic_year_passed_exam_qe2"
                                value={
                                  data.graduate_advisor ? data.graduate_advisor?.academic_year_passed_exam_qe2 : null
                                }
                                onChange={handleChangeAdvisor}
                                InputLabelProps={{ shrink: true }}
                              />
                            </Stack>
                          </Stack>
                        </Stack>
                      </Stack>
                    </>
                  )}
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          <DataMastersPageTwo
            onFormChange={handleFormChange}
            lecturer={lecturer}
            lecturerNames={lecturerNames}
            editData={defData}
          />
          <DataMastersPageThree
            onFormChange={handleFormChange}
            lecturer={lecturer}
            lecturerNames={lecturerNames}
            editData={defExData}
          />
          <DataMastersPageFour
            onFormChange={handleFormChange}
            lecturer={lecturer}
            lecturerNames={lecturerNames}
            editData={pubData}
          />
          <DataMastersPageFive
            onFormChange={handleFormChange}
            lecturer={lecturer}
            lecturerNames={lecturerNames}
            editData={gradData}
          />

          <Stack justifyContent="start" direction="row" sx={{ px: 12, pt: 6, pb: 12 }}>
            <LoadingButton
              style={{ borderRadius: '25px' }}
              size="large"
              // variant={step === 3 ? 'contained' : 'outlined'}
              variant="contained"
              loading={loadingSend && isSubmitting}
              // onClick={handleSubmit(createWorkload)}
              // onClick={handleSubmit(createWorkload(renderPage))}
              onClick={handleFormSubmit}
              sx={{ px: 6 }}
            >
              บันทึกข้อมูลการสอบ
            </LoadingButton>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
