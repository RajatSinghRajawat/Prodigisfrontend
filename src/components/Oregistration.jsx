import { useState, useEffect } from "react"
import {
  Card,
  Input,
  DatePicker,
  Select,
  Button,
  Form,
  Row,
  Col,
  Typography,
  Space,
  message
} from 'antd';
import {
  CalendarOutlined,
  PlusOutlined,
  CloseOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { TextArea } = Input;

export default function Oregistration({ fun, ID }) {
  const [plans, setPlans] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  
  // Use ID from props
  const competitionId = ID;

  // Form data state
  const [registrationData, setRegistrationData] = useState({
    totalRegistrationFee: '',
    registrationStartDate: '8th Jul 2025',
    registrationEndDate: '16th Jul 2025',
    bankAccount: 'visa_6798'
  });

  // Fetch registration data
  const fetchRegistrationData = async () => {
    if (!competitionId) return;

    setFetchLoading(true);
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      const response = await fetch(`http://localhost:3001/api/competitions/registration/${competitionId}`, requestOptions);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Fetched Registration Data:', result);
        
        if (result.success && result.data) {
          const { registration_type, plans: fetchedPlans } = result.data;
          
          // Update registration data
          if (registration_type) {
            console.log('Setting registration data:', registration_type);
            setRegistrationData({
              totalRegistrationFee: registration_type.total_registration_fee || '',
              registrationStartDate: registration_type.registration_start_date || '8th Jul 2025',
              registrationEndDate: registration_type.registration_end_date || '16th Jul 2025',
              bankAccount: registration_type.bank_account || 'visa_6798'
            });
          }
          
          // Update plans data
          if (fetchedPlans && Array.isArray(fetchedPlans)) {
            console.log('Setting plans data:', fetchedPlans);
            const formattedPlans = fetchedPlans.map((plan, index) => ({
              id: Date.now() + index,
              name: plan.name || '',
              planFee: plan.plan_fee || '',
              studentLimit: plan.student_limit || '',
              description: plan.description || '',
              included: plan.included || '',
              notIncluded: plan.not_included || ''
            }));
            setPlans(formattedPlans);
          }
        }
      } else {
        console.log('No existing registration data found');
      }
    } catch (error) {
      console.error('Error fetching registration data:', error);
      // Don't show error message as this might be the first time creating registration
    } finally {
      setFetchLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    if (competitionId) {
      console.log('Fetching registration data for competition ID:', competitionId);
      fetchRegistrationData();
    }
  }, [competitionId]);

  const addPlan = () => {
    const newPlan = {
      id: Date.now(),
      name: '',
      planFee: '',
      studentLimit: '',
      description: '',
      included: '',
      notIncluded: ''
    };
    setPlans([...plans, newPlan]);
  };

  const removePlan = (planId) => {
    setPlans(plans.filter(plan => plan.id !== planId));
  };

  const updatePlan = (planId, field, value) => {
    setPlans(plans.map(plan =>
      plan.id === planId ? { ...plan, [field]: value } : plan
    ));
  };

  const updateRegistrationData = (field, value) => {
    setRegistrationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!registrationData.totalRegistrationFee) {
        message.error('Please enter total registration fee');
        return;
      }

      if (plans.length === 0) {
        message.error('Please add at least one plan');
        return;
      }

      // Validate plans
      for (let i = 0; i < plans.length; i++) {
        const plan = plans[i];
        if (!plan.name || !plan.planFee || !plan.description || !plan.included || !plan.notIncluded) {
          message.error(`Please fill all required fields for Plan ${i + 1}`);
          return;
        }
      }

      setLoading(true);

      // alert(ID)
      // return ;

      // Prepare API data structure
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const apiData = {
        registration_type: {
          total_registration_fee: registrationData.totalRegistrationFee,
          registration_start_date: registrationData.registrationStartDate,
          registration_end_date: registrationData.registrationEndDate,
          bank_account: registrationData.bankAccount
        },
        plans: plans.map(plan => ({
          name: plan.name,
          plan_fee: plan.planFee,
          student_limit: plan.studentLimit || null,
          description: plan.description,
          included: plan.included,
          not_included: plan.notIncluded
        }))
      };

      const raw = JSON.stringify(apiData);

      // Determine if this is create or update
      const isUpdate = plans.length > 0 && registrationData.totalRegistrationFee; // Assuming if data exists, it's an update
      
      const requestOptions = {
        method: "POST", // Backend uses POST for both create and update
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      }; 
      const response = await fetch(`http://localhost:3001/api/competitions/registration/${competitionId}`, requestOptions);
      
      if (response.ok) {
        const result = await response.text();
        console.log('API Response:', result);
        message.success('Registration data saved successfully!');

        // Call parent function if provided
        fun(5, competitionId)
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

    } catch (error) {
      console.error('API Error:', error);
      message.error('Failed to save registration data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', color: '#666' }}>Loading registration data...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      width: '100%'
    }}>
      <div style={{
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '40px',
        scrollbarWidth: 'thin',
        scrollbarColor: '#c1c1c1 #f1f1f1'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Title level={2} style={{
            marginBottom: '40px',
            fontWeight: '600',
            color: '#000000',
            fontSize: '32px'
          }}>
            Registration
          </Title>

          <Form form={form} layout="vertical">
            {/* Total Registration Fee */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#000000'
              }}>
                Total Registration Fee<span style={{ color: '#ff4d4f' }}>*</span>
              </label>
              <div className="registration-fee-input">
                <Input
                  placeholder="Enter"
                  addonBefore={<span style={{ color: '#000000' }}>₹</span>}
                  value={registrationData.totalRegistrationFee}
                  onChange={(e) => updateRegistrationData('totalRegistrationFee', e.target.value)}
                  style={{
                    height: '48px',
                    fontSize: '16px',
                    borderColor: '#d9d9d9',
                    borderRadius: '6px',
                    maxWidth: '400px'
                  }}
                />
              </div>
            </div>

            {/* Registrations Open */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#000000'
              }}>
                Registrations Open<span style={{ color: '#ff4d4f' }}>*</span>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} className="form-registration">
                <Input
                  value={registrationData.registrationStartDate}
                  onChange={(e) => updateRegistrationData('registrationStartDate', e.target.value)}
                  suffix={<CalendarOutlined style={{ color: '#999' }} />}
                  style={{
                    height: '48px',
                    fontSize: '16px',
                    borderRadius: '6px',
                    width: '200px',
                    backgroundColor: '#ffffff'
                  }}
                />
                <span style={{ fontSize: '16px', color: '#000000' }}>to</span>
                <Input
                  value={registrationData.registrationEndDate}
                  onChange={(e) => updateRegistrationData('registrationEndDate', e.target.value)}
                  suffix={<CalendarOutlined style={{ color: '#999' }} />}
                  style={{
                    height: '48px',
                    fontSize: '16px',
                    borderColor: '#d9d9d9',
                    borderRadius: '6px',
                    width: '200px',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>
            </div>

            {/* Bank Account */}
            <div style={{ marginBottom: '40px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#000000'
              }}>
                Bank Account<span style={{ color: '#ff4d4f' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <Select
                  value={registrationData.bankAccount}
                  onChange={(value) => updateRegistrationData('bankAccount', value)}
                  style={{
                    width: '400px',
                    height: '48px'
                  }}
                  dropdownStyle={{ borderRadius: '6px' }}
                >
                  <Select.Option value="visa_6798">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{
                        backgroundColor: '#1e40af',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        marginRight: '12px'
                      }}>
                        VISA
                      </span>
                      <span style={{ fontSize: '16px', color: '#000000' }}>
                        XXXX XXXX XXXX 6798
                      </span>
                    </div>
                  </Select.Option>
                </Select>
                <Button
                  type="primary"
                  style={{
                    backgroundColor: '#52c41a',
                    borderColor: '#52c41a',
                    height: '48px',
                    fontSize: '16px',
                    fontWeight: '500',
                    borderRadius: '6px',
                    paddingLeft: '24px',
                    paddingRight: '24px'
                  }}
                >
                  Add Bank Account
                </Button>
              </div>
            </div>

            {/* Plans */}
            {plans.map((plan, index) => (
              <div
                key={plan.id}
                style={{
                  border: '1px solid #d9d9d9',
                  borderRadius: '8px',
                  padding: '24px',
                  marginBottom: '24px',
                  backgroundColor: '#ffffff'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px'
                }}>
                  <span style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#000000'
                  }}>
                    Plan {index + 1}
                  </span>
                  <Button
                    type="text"
                    icon={<CloseOutlined />}
                    onClick={() => removePlan(plan.id)}
                    style={{
                      color: '#666',
                      border: 'none',
                      background: 'transparent'
                    }}
                  />
                </div>

                {/* Name, Plan Fee, Student Limit Row */}
                <Row gutter={24} style={{ marginBottom: '24px' }}>
                  <Col span={8}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#000000'
                    }}>
                      Name<span style={{ color: '#ff4d4f' }}>*</span>
                    </label>
                   
                      
                    <Input
                      placeholder="Enter plan name"
                      value={plan.name}
                      onChange={(e) => updatePlan(plan.id, 'name', e.target.value)}
                      style={{
                        height: '48px',
                        fontSize: '16px',
                        borderColor: '#d9d9d9',
                        borderRadius: '6px'
                      }}
                    /> 
                  </Col>
                  <Col span={8}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#000000'
                    }}>
                      Plan Fee<span style={{ color: '#ff4d4f' }}>*</span>
                    </label>
                     <div className="registration-fee-input">

                    <Input
                      placeholder="Enter"
                      addonBefore={<span style={{ color: '#000000' }}>₹</span>}
                      value={plan.planFee}
                      onChange={(e) => updatePlan(plan.id, 'planFee', e.target.value)}
                      style={{
                        height: '48px',
                        fontSize: '16px',
                        borderColor: '#d9d9d9',
                        borderRadius: '6px'
                      }}
                    />
                     </div>
                  </Col>
                  <Col span={8}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#000000'
                    }}>
                      Student Limit
                    </label>
                    <Input
                      placeholder="Enter"
                      value={plan.studentLimit}
                      onChange={(e) => updatePlan(plan.id, 'studentLimit', e.target.value)}
                      style={{
                        height: '48px',
                        fontSize: '16px',
                        borderColor: '#d9d9d9',
                        borderRadius: '6px'
                      }}
                    />
                  </Col>
                </Row>

                {/* Plan Description */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#000000'
                  }}>
                    Plan Description<span style={{ color: '#ff4d4f' }}>*</span>
                  </label>
                  <TextArea
                    placeholder="Short Description of the Plan"
                    rows={3}
                    value={plan.description}
                    onChange={(e) => updatePlan(plan.id, 'description', e.target.value)}
                    style={{
                      fontSize: '16px',
                      borderColor: '#d9d9d9',
                      borderRadius: '6px',
                      backgroundColor: '#ffffff'
                    }}
                  />
                </div>

                {/* What Is Included and What Is Not Included */}
                <Row gutter={24}>
                  <Col span={12}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#000000'
                    }}>
                      What Is Included?<span style={{ color: '#ff4d4f' }}>*</span>
                    </label>
                    <TextArea
                      placeholder="Add bullet points on inclusions in the plan"
                      rows={6}
                      value={plan.included}
                      onChange={(e) => updatePlan(plan.id, 'included', e.target.value)}
                      style={{
                        fontSize: '16px',
                        borderColor: '#d9d9d9',
                        borderRadius: '6px',
                        backgroundColor: '#fafafa'
                      }}
                    />
                  </Col>
                  <Col span={12}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#000000'
                    }}>
                      What Is Not Included?<span style={{ color: '#ff4d4f' }}>*</span>
                    </label>
                    <TextArea
                      placeholder="Highlight what is not included in your plan"
                      rows={6}
                      value={plan.notIncluded}
                      onChange={(e) => updatePlan(plan.id, 'notIncluded', e.target.value)}
                      style={{
                        fontSize: '16px',
                        borderColor: '#d9d9d9',
                        borderRadius: '6px',
                        backgroundColor: '#fafafa'
                      }}
                    />
                  </Col>
                </Row>
              </div>
            ))}

            {/* Add a Plan Button */}
            <div style={{ marginBottom: '40px' }}>
              <Button
                type="link"
                icon={<PlusOutlined />}
                onClick={addPlan}
                style={{
                  color: '#1890ff',
                  fontSize: '16px',
                  padding: '0',
                  height: 'auto',
                  fontWeight: '500'
                }}
              >
                Add a Plan
              </Button>
            </div>

            {/* Save and Continue Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '40px' }}>
              <Button
                type="primary"
                size="large"
                loading={loading}
                onClick={handleSubmit}
                style={{
                  backgroundColor: plans.length > 0 && registrationData.totalRegistrationFee ? '#4CAF50' : '#d9d9d9',
                  // borderColor: plans.length > 0 && registrationData.totalRegistrationFee ? '#1890ff' : '#d9d9d9',
                  color: plans.length > 0 && registrationData.totalRegistrationFee ? '#ffffff' : '#666666',
                  height: '48px',
                  paddingLeft: '32px',
                  paddingRight: '32px',
                  fontSize: '16px',
                  fontWeight: '500',
                  borderRadius: '6px'
                }}
              >
                Save and Continue
              </Button>
            </div>
          </Form>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        /* Webkit browsers (Chrome, Safari, Edge) */
        div::-webkit-scrollbar {
          width: 8px;
        }
        
        div::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        
        div::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        
        div::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
        
        /* Firefox */
        div {
          scrollbar-width: thin;
          scrollbar-color: #c1c1c1 #f1f1f1;
        }
      `}</style>
    </div>
  )
}
