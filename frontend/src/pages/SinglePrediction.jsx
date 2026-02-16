import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { makeSinglePrediction } from '../services/predictionService';
import toast from 'react-hot-toast';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const SinglePrediction = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      Gender: '',
      Age: '',
      Driving_License: '1',
      Region_Code: '',
      Previously_Insured: '0',
      Vehicle_Age: '',
      Vehicle_Damage: '',
      Annual_Premium: '',
      Policy_Sales_Channel: '',
      Vintage: '',
    },
    validationSchema: Yup.object({
      Gender: Yup.string().required('Required'),
      Age: Yup.number().min(18, 'Must be at least 18').max(100, 'Must be less than 100').required('Required'),
      Region_Code: Yup.number().required('Required'),
      Previously_Insured: Yup.string().required('Required'),
      Vehicle_Age: Yup.string().required('Required'),
      Vehicle_Damage: Yup.string().required('Required'),
      Annual_Premium: Yup.number().min(0, 'Must be positive').required('Required'),
      Policy_Sales_Channel: Yup.number().required('Required'),
      Vintage: Yup.number().min(0, 'Must be positive').required('Required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        // Convert string values to numbers for API
        const formattedData = {
          Gender: values.Gender,
          Age: parseInt(values.Age),
          Driving_License: parseInt(values.Driving_License),
          Region_Code: parseFloat(values.Region_Code),
          Previously_Insured: parseInt(values.Previously_Insured),
          Vehicle_Age: values.Vehicle_Age,
          Vehicle_Damage: values.Vehicle_Damage,
          Annual_Premium: parseFloat(values.Annual_Premium),
          Policy_Sales_Channel: parseFloat(values.Policy_Sales_Channel),
          Vintage: parseInt(values.Vintage),
        };
        
        const response = await makeSinglePrediction(formattedData);
        setResult(response);
        toast.success('Prediction completed successfully!');
      } catch (error) {
        toast.error('Failed to make prediction. Please try again.');
        console.error('Prediction error:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleReset = () => {
    formik.resetForm();
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Single Prediction
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Enter customer details to predict insurance interest
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 card">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="Gender" className="label">
                    Gender
                  </label>
                  <select
                    id="Gender"
                    name="Gender"
                    className="input-field"
                    {...formik.getFieldProps('Gender')}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {formik.touched.Gender && formik.errors.Gender && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.Gender}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="Age" className="label">
                    Age
                  </label>
                  <input
                    id="Age"
                    name="Age"
                    type="number"
                    className="input-field"
                    placeholder="Enter age"
                    {...formik.getFieldProps('Age')}
                  />
                  {formik.touched.Age && formik.errors.Age && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.Age}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="Driving_License" className="label">
                    Driving License
                  </label>
                  <select
                    id="Driving_License"
                    name="Driving_License"
                    className="input-field"
                    {...formik.getFieldProps('Driving_License')}
                  >
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="Region_Code" className="label">
                    Region Code
                  </label>
                  <input
                    id="Region_Code"
                    name="Region_Code"
                    type="number"
                    className="input-field"
                    placeholder="Enter region code"
                    {...formik.getFieldProps('Region_Code')}
                  />
                  {formik.touched.Region_Code && formik.errors.Region_Code && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.Region_Code}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Vehicle Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="Vehicle_Age" className="label">
                    Vehicle Age
                  </label>
                  <select
                    id="Vehicle_Age"
                    name="Vehicle_Age"
                    className="input-field"
                    {...formik.getFieldProps('Vehicle_Age')}
                  >
                    <option value="">Select Age</option>
                    <option value="< 1 Year">&lt; 1 Year</option>
                    <option value="1-2 Year">1-2 Years</option>
                    <option value="> 2 Years">&gt; 2 Years</option>
                  </select>
                  {formik.touched.Vehicle_Age && formik.errors.Vehicle_Age && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.Vehicle_Age}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="Vehicle_Damage" className="label">
                    Vehicle Damage History
                  </label>
                  <select
                    id="Vehicle_Damage"
                    name="Vehicle_Damage"
                    className="input-field"
                    {...formik.getFieldProps('Vehicle_Damage')}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  {formik.touched.Vehicle_Damage && formik.errors.Vehicle_Damage && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.Vehicle_Damage}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Insurance Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Insurance Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="Previously_Insured" className="label">
                    Previously Insured
                  </label>
                  <select
                    id="Previously_Insured"
                    name="Previously_Insured"
                    className="input-field"
                    {...formik.getFieldProps('Previously_Insured')}
                  >
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="Annual_Premium" className="label">
                    Annual Premium
                  </label>
                  <input
                    id="Annual_Premium"
                    name="Annual_Premium"
                    type="number"
                    className="input-field"
                    placeholder="Enter annual premium"
                    {...formik.getFieldProps('Annual_Premium')}
                  />
                  {formik.touched.Annual_Premium && formik.errors.Annual_Premium && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.Annual_Premium}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="Policy_Sales_Channel" className="label">
                    Policy Sales Channel
                  </label>
                  <input
                    id="Policy_Sales_Channel"
                    name="Policy_Sales_Channel"
                    type="number"
                    className="input-field"
                    placeholder="Enter channel code"
                    {...formik.getFieldProps('Policy_Sales_Channel')}
                  />
                  {formik.touched.Policy_Sales_Channel && formik.errors.Policy_Sales_Channel && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.Policy_Sales_Channel}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="Vintage" className="label">
                    Vintage (Days)
                  </label>
                  <input
                    id="Vintage"
                    name="Vintage"
                    type="number"
                    className="input-field"
                    placeholder="Customer association days"
                    {...formik.getFieldProps('Vintage')}
                  />
                  {formik.touched.Vintage && formik.errors.Vintage && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.Vintage}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Predicting...' : 'Predict'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 btn-secondary"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Result Panel */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Prediction Result
            </h3>
            
            {!result ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  Fill the form and click predict to see results
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`p-6 rounded-lg ${
                  result.prediction === 1 
                    ? 'bg-green-50 dark:bg-green-900/20' 
                    : 'bg-red-50 dark:bg-red-900/20'
                }`}>
                  <div className="flex items-center justify-center mb-4">
                    {result.prediction === 1 ? (
                      <CheckCircleIcon className="h-16 w-16 text-green-500" />
                    ) : (
                      <XCircleIcon className="h-16 w-16 text-red-500" />
                    )}
                  </div>
                  <h4 className={`text-xl font-bold text-center ${
                    result.prediction === 1 
                      ? 'text-green-700 dark:text-green-400' 
                      : 'text-red-700 dark:text-red-400'
                  }`}>
                    {result.prediction === 1 ? 'Customer is Interested!' : 'Customer Not Interested'}
                  </h4>
                </div>

                {result.probability && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Confidence Score
                    </p>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${result.probability * 100}%` }}
                        />
                      </div>
                      <span className="ml-4 text-lg font-bold text-gray-900 dark:text-white">
                        {(result.probability * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePrediction;
