// form
import { useFieldArray, useFormContext } from 'react-hook-form';
// @mui
import { Autocomplete, Button, Checkbox, Stack, TextField, Typography } from '@mui/material';
// utils
// components
import DatePicker from '@mui/lab/DatePicker';
import Iconify from '../../../../Iconify';

import FormControlLabel from '@mui/material/FormControlLabel';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';

//hook
import { useSelector } from '../../../../../redux/store';
import { MASTERS_LEVELARTICLE, MASTERS_STATUS1, MASTERS_TYPEARTICLE } from '../../Data/datamasters';
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

const steps = ['General Information', 'Education', 'Address'];

export default function WorkloadPageFour({
  isFetchApi,
  handleSetCourseForFill,
  courseForFill,
  onFormChange,
  editData,
  lecturerNames,
  lecturer,
}) {
  const { control, setValue, watch } = useFormContext();
  const [isDisable, setIsDisable] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const { renderPage, yearSelected, isLoading, editDataForFill, typeSubmit, courseData } = useSelector(
    (state) => state.workloadRender
  );

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const values = watch();

  // console.log('values => ', values);

  const [checked, setChecked] = useState([
    values.workload_hours_1 ? true : false,
    values.workload_hours_2 ? true : false,
    values.workload_hours_3 ? true : false,
    values.workload_hours_4 ? true : false,
    values.workload_hours_5_1 || values.workload_hours_5_2,
    values.workload_hours_6 ? true : false,
    values.workload_hours_7 ? true : false,
    values.workload_hours_8 ? true : false,
    values.workload_hours_9_1 || values.workload_hours_9_2,
    values.workload_hours_10_1 || values.workload_hours_10_2,
    values.workload_hours_11_1 ||
      values.workload_hours_11_2 ||
      values.workload_hours_11_3 ||
      values.workload_hours_11_4,
    values.workload_hours_12 ? true : false,
  ]);
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

  const checkedMasters = (index) => {
    setChecked({ ...checked, [index]: !checked[index] });
    setFormData((prevData) => {
      const updatedData = { ...prevData };
      updatedData.published = checked[1] ? 0 : 1;
      onFormChange('graduate_published', { ...updatedData });
      return updatedData;
    });
  };

  const checkedMastersSub = (index) => {
    const newArrSub = [...checkedSub];
    console.log(newArrSub);
    newArrSub[index] = !newArrSub[index];
    setCheckedSub(newArrSub);
    console.log(newArrSub);
  };

  const handleAddPosition = () => {
    append(
      [
        {
          title: '',
          description: '',
          service: '',
          quantity: '',
          price: '',
          total: '5',
          // dob:new Date();
        },
      ],
      [
        {
          lecturer_position: '',
          position_other: '',
          position_date: '',
        },
      ]
    );
  };

  const handleAddResearch = () => {
    append({
      researchInterest: 'medic',
    });
  };

  const handleRemove = (index) => {
    remove(index);
  };
  //-------------stepper--------------------------------------------------
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [date, setDate] = useState(null);
  const isStepOptional = (step) => {
    return step === 1;
  };
  const [selectedLecturerNames, setSelectedLecturerNames] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDatePG, setSelectedDatePG] = useState(null);
  const [selectedJournalLevel, setSelectedJournalLevel] = useState(null);
  const [selectedMasterStatus, setSelectedMasterStatus] = useState(null);
  const [fetchDataCo, setFetchDataCo] = useState([]);

  const [formData, setFormData] = useState({
    id: null,
    published: 0,
    thai_title_published_graduation: '',
    english_title_published_graduation: '',

    thesis_advisor_published_graduation: '',
    lecturer_number: '',
    graduate_co_published: [
      {
        // thesis_co_advisor_published_graduation: '',
      },
    ],

    publish_graduation_detail: [
      {
        //     patent_published_graduation: '',
        // type_article_published_graduation: '',
        // journal_published_graduation: '',
        // level_article_published_graduation: '',
        // date_published_graduation: '',
        // db_published_graduation: '',
        // page_number_published_graduation: '',
        // status_published_graduation: '',
        // volume_published_graduation: '',
        // issue_published_graduation: '',
      },
    ],
  });
  useEffect(() => {
    if (!isEmpty(editData)) {
      setEditMode(true);
      setFormData(editData);
      setChecked((prevState) => ({ ...prevState, 1: editData }));
      console.log('editData Four =>', editData);
      if (editData.graduate_co_published) {
        // setFormData((prevData) => ({
        //   ...prevData,
        //   graduate_co_published: editData.graduate_co_published,
        // }));

        const updatedFetchDataCo = [...fetchDataCo, ...editData.graduate_co_published];
        if (isEmpty(fetchDataCo)) {
          setFetchDataCo(updatedFetchDataCo);
        }
      }
      if (editData.date_published_graduation) {
        setDate(editData.date_published_graduation);
      }
      // if (!isEmpty(editData.graduate_co_published)) {
      //   setFormData((prevFormData) => {
      //     return {
      //       ...prevFormData,
      //       graduate_co_published: '',
      //     };
      //   });
      // }
    }
  }, [editData]);

  useEffect(() => {
    onFormChange('graduate_published', { ...formData });
    console.log('formData Update Four =>', formData);
  }, [formData]);

  useEffect(() => {
    if (!isEmpty(formData.graduate_co_published)) {
      setBacsFields(fetchDataCo);
      setForceRender((prev) => !prev);
    }
    console.log('fetchDataCo Four', fetchDataCo);
    console.log('BackFields Four', bacsFields);
  }, [fetchDataCo]);

  const [bacsFields, setBacsFields] = useState([]);
  const [bacsId, setBacsId] = useState(fetchDataCo ? fetchDataCo.length + 1 : 2);
  const [forceRender, setForceRender] = useState(false);
  const [detailFields, setDetailFields] = useState([]);
  const [detailId, setDetailId] = useState(1);

  const addBacsField = () => {
    setBacsFields([...bacsFields, { id: bacsId }]);
    setBacsId(bacsId + 1);
  };

  const removeBacsField = (index) => {
    const list = [...bacsFields];
    list.splice(index, 1);
    setBacsFields(list);
    setFormData((prevFormData) => {
      const updatedCoAdvisor = [...prevFormData.graduate_co_published];
      updatedCoAdvisor.splice(index, 1);
      return {
        ...prevFormData,
        graduate_co_published: updatedCoAdvisor,
      };
    });
  };

  const addDetailField = () => {
    setDetailFields([...detailFields, { id: detailId }]);
    setDetailId(detailId + 1);
  };

  const removeDetailField = (index) => {
    const list = [...detailFields];
    list.splice(index, 1);
    setDetailFields(list);
  };

  const handleArrayChange = (index, fieldName, value) => {
    const coPublished = formData.graduate_co_published || [];

    if (index === coPublished.length) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        graduate_co_published: [
          ...coPublished,
          {
            thesis_co_advisor_published_graduation: '',
          },
        ],
      }));
    }

    const updatedCoAdvisor = [...coPublished];
    updatedCoAdvisor[index] = {
      ...updatedCoAdvisor[index],
      [fieldName]: value,
    };

    setFormData((prevFormData) => ({
      ...prevFormData,
      graduate_co_published: updatedCoAdvisor,
    }));
    onFormChange('graduate_published', { ...formData });
  };
  const handleChangeAdvisorName = (event, newValue) => {
    setSelectedLecturerNames(newValue);
    formData.thesis_advisor_published_graduation = newValue;
    const foundLecturer = lecturer.find((lecturer) => lecturer.fullname_th === newValue);
    if (foundLecturer) {
      formData.lecturer_number = foundLecturer.lecturer_number;
      formData.thesis_advisor_published_graduation = foundLecturer?.fullname_th;
    }
    onFormChange('graduate_published', { ...formData });
  };
  const handleCategory = (event, newValue) => {
    setSelectedCategory(newValue);
    formData.type_article_published_graduation = newValue;
    const foundCategory = MASTERS_TYPEARTICLE.find((category) => category === newValue);
    if (foundCategory) {
      formData.type_article_published_graduation = foundCategory;
    }
  };
  
  const handleJournalLevel = (event, newValue) => {
    setSelectedJournalLevel(newValue);
    formData.level_article_published_graduation = newValue;
    const foundJournalLevel = MASTERS_LEVELARTICLE.find((journalLevel) => journalLevel === newValue);
    if (foundJournalLevel) {
      formData.level_article_published_graduation = foundJournalLevel;
    }
  };

  const handleMasterStatus = (event, newValue) => {
    setSelectedMasterStatus(newValue);
    formData.status_published_graduation = newValue;
    const foundMasterStatus = MASTERS_STATUS1.find((masterStatus) => masterStatus === newValue);
    if (foundMasterStatus) {
      formData.status_published_graduation = foundMasterStatus;
    }
  };
  const handleDateChange = (date) => {
    setDate(date);
    formData.date_published_graduation = date;
  };
  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleChangeCourseCode = (event, v) => {
    console.log('evenet>>>>>. ', event);
    console.log('value >>>>>>', v);
    console.log('value split', v.split(' - ')[0]);
    console.log('event select => ', event.target.value);
    handleSetCourseForFill(
      courseData.find((element) => element.course_code == v.split(' - ')[0]),
      'workload_1'
    );
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    onFormChange('graduate_published', { ...formData, [name]: value });
  };

  const handlePublishGradChange = (index, fieldName, value) => {
    setFormData((prevData) => {
        // Create a copy of the current publish_graduation_detail array
        const updatedPublishedGraduationDetail = [...prevData.publish_graduation_detail];
        
        // If the index is equal to the length, we need to add a new item
        if (index === updatedPublishedGraduationDetail.length) {
            updatedPublishedGraduationDetail.push({

                type_article_published_graduation: '',
    
                level_article_published_graduation: '',
                date_published_graduation: '',
              
            });
        }
        
        // Update the specific field of the specific entry
        updatedPublishedGraduationDetail[index] = {
            ...updatedPublishedGraduationDetail[index],
            [fieldName]: value,
        };

        // Return the new state
        return {
            ...prevData,
            publish_graduation_detail: updatedPublishedGraduationDetail,
        };
    });
    
    // Call onFormChange with the updated state
    setFormData((prevData) => {
        const updatedFormData = {
            ...prevData,
            publish_graduation_detail: [
                ...prevData.publish_graduation_detail.slice(0, index),
                {
                    ...prevData.publish_graduation_detail[index],
                    [fieldName]: value,
                },
                ...prevData.publish_graduation_detail.slice(index + 1),
            ],
        };
        onFormChange('graduate_published', updatedFormData);
        return updatedFormData;
    });
};

 
  //-----------------------------------------------------------------------------
  return (
    <Stack>
      <FormControlLabel
        label="ตีพิมพ์เพื่อสำเร็จการศึกษา "
        name="workload_subtype"
        control={<Checkbox checked={checked[1]} onChange={() => checkedMasters(1)} />}
      />
      {checked[1] && (
        <>
          <Stack spacing={3} sx={{ p: 3, pl: 6 }}>
            <Typography variant="h5" color="#545454">
              หัวข้อ
            </Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
              <TextField
                fullWidth
                disablePortal
                sx={{ width: 420 }}
                label="หัวข้อ (ภาษาไทย)  "
                name="thai_title_published_graduation"
                value={formData.thai_title_published_graduation}
                onChange={handleChange}
                placeholder="ข้อความ"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                disablePortal
                fullWidth
                sx={{ width: 420 }}
                label="หัวข้อ (ภาษาอังกฤษ) "
                placeholder="ข้อความ"
                name="english_title_published_graduation"
                value={formData.english_title_published_graduation}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
            <Typography variant="h5" color="#545454">
              อาจารย์ที่ปรึกษาวิทยานิพนธ์
            </Typography>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={lecturerNames}
              sx={{ width: 860 }}
              freeSolo
              value={editMode ? formData.thesis_advisor_published_graduation : selectedLecturerNames}
              onChange={handleChangeAdvisorName}
              renderInput={(params) => <TextField {...params} label="ชื่ออาจารย์ที่ปรึกษาวิทยานิพนธ์" />}
            />
            {/* <TextField
              disablePortal
              sx={{ width: 860 }}
              label="รหัสประจำตัวอาจารย์ที่ปรึกษา"
              placeholder="ข้อความ"
              name="lecturer_number"
              value={formData.lecturer_number}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            /> */}
            <Typography variant="h5" color="#545454">
              อาจารย์ที่ปรึกษาวิทยานิพนธ์ร่วม
            </Typography>
            {bacsFields.map((field, index) => (
              <div key={field.id} style={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  disablePortal
                  sx={{ width: 855 }}
                  // name={`co-advisor[${index}].nameCo_advisor`}
                  label="อาจารย์ที่ปรึกษาวิทยานิพนธ์ร่วม Thesis co-advisor "
                  placeholder="ข้อความ"
                  name={`${index}.thesis_co_advisor_published_graduation`}
                  defaultValue={field.thesis_co_advisor_published_graduation}
                  onChange={(e) => handleArrayChange(index, 'thesis_co_advisor_published_graduation', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <Button size="small" color="error" onClick={() => removeBacsField(index)}>
                  ลบออก
                </Button>
              </div>
            ))}

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
              <Button size="small" startIcon={<Iconify icon="eva:plus-fill" />} onClick={addBacsField}>
                เพิ่มอาจารย์ที่ปรึกษาร่วม
              </Button>
            </Stack>
            <Typography variant="h5" color="#545454">
              รายละเอียดผลงานตีพิมพ์
            </Typography>
            {detailFields.map((field, index) => (
              <Stack key={index} spacing={3}>
                <Typography variant="h7" color="#545454">
              รายละเอียดผลงานตีพิมพ์ {index +1}
            </Typography>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                  <TextField
                    disablePortal
                    sx={{ width: 420 }}
                    label="ชื่อผลงานที่ตีพิมพ์ / ผลงานที่ได้รับการจดอนุสิทธิบัตร / สิทธิบัตร  "
                    placeholder="ข้อความ"
                    name={`graduate_published.${index}.patent_published_graduation`}
                    value={formData.patent_published_graduation}
                    onChange={(e) => handlePublishGradChange(index, 'patent_published_graduation', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={MASTERS_TYPEARTICLE}
                    sx={{ width: 420 }}
                    name={ `graduate_published.${index}.type_article_published_graduation`}
                    // value={editMode ? formData.type_article_published_graduation : selectedCategory}
                    defaultValue={field.type_article_published_graduation}
                    onChange={handleCategory}
                    renderInput={(params) => <TextField {...params} label="ประเภทบทความ" />}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                  <TextField
                    disablePortal
                    sx={{ width: 420 }}
                    id="combo-box-demo"
                    label="ชื่อวารสารวิชาการ / การเผยแพร่  "
                    placeholder="ข้อความ"
                    name={`graduate_published.${index}.journal_published_graduation`}
                    value={formData.journal_published_graduation}
                    onChange={(e) => handlePublishGradChange(index, 'journal_published_graduation', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={MASTERS_LEVELARTICLE}
                    sx={{ width: 420 }}
                    name={`graduate_published.${index}.level_article_published_graduation`}
                    value={field.level_article_published_graduation}
                    onChange={handleJournalLevel}
                    renderInput={(params) => <TextField {...params} label="ระดับบทความ" />}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                  <DatePicker
                    disablePortal
                    id="combo-box-demo"
                    inputFormat="dd/MM/yyyy"
                    name={`graduate_published.${index}.date_published_graduation`}
                    value={date}
                    onChange={(e, newValue) => handleDatePickerPG(e, newValue)}
                    renderInput={(params) => <TextField {...params} sx={{ width: 420 }} label="วันเดือนปีที่ตีพิมพ์" />}
                  />

                  <TextField
                    disablePortal
                    sx={{ width: 420 }}
                    label="ตีพิมพ์ในฐานข้อมูล "
                    placeholder="ข้อความ"
                    name={`graduate_published.${index}.db_published_graduation`}
                    value={formData.db_published_graduation}
                    onChange={(e) => handlePublishGradChange(index, 'db_published_graduation', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                  <TextField
                    disablePortal
                    sx={{ width: 420 }}
                    label="เลขหน้า"
                    placeholder="ข้อความ"
                    name={`graduate_published.${index}.page_number_publisher_graduation`}
                    value={formData.page_number_published_graduation}
                    onChange={(e) => handlePublishGradChange(index, 'page_number_publisher_graduation', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={MASTERS_STATUS1}
                    sx={{ width: 420 }}
                    name={`graduate_published.${index}.status_published_graduation`}
                    value={field.status_published_graduation}
                    onChange={handleMasterStatus}
                    renderInput={(params) => <TextField {...params} label="Status" />}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                  <TextField
                    disablePortal
                    sx={{ width: 420 }}
                    label="Volume"
                    placeholder="ข้อความ"
                    name="volume_published_graduation"
                    value={formData.volume_published_graduation}
                    onChange={(e) => handlePublishGradChange(index, 'volume_published_graduation', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    disablePortal
                    sx={{ width: 420 }}
                    label="Issue"
                    placeholder="ข้อความ"
                    name="issue_published_graduation"
                    value={formData.issue_published_graduation}
                    onChange={(e) => handlePublishGradChange(index, 'issue_published_graduation', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Stack>

                <Stack spacing={3}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1, pt: 1 }}>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<Iconify icon="ic:outline-minus" />}
                      onClick={() => removeDetailField(index)}
                      sx={{ flexShrink: 0 }}
                    >
                      ลบออก
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            ))}
            {checked[1] && (
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                  <Button size="small" startIcon={<Iconify icon="eva:plus-fill" />} onClick={addDetailField}>
                    เพิ่มรายละเอียดผลงานตีพิมพ์
                  </Button>
                </Stack>
              </Stack>
            )}
          </Stack>
        </>
      )}
    </Stack>
  );
}
