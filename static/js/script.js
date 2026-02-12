// Get form elements
const form = document.getElementById('predictionForm');
const resultSection = document.getElementById('resultSection');
const resultContent = document.getElementById('resultContent');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');
const clearBtn = document.getElementById('clearForm');
const themeToggle = document.getElementById('themeToggle');

// Dark mode toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = themeToggle.querySelector('.theme-icon');
    icon.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    
    // Save preference
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// Load dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    themeToggle.querySelector('.theme-icon').textContent = '☀️';
}

// Clear form button
clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all fields?')) {
        form.reset();
        resultSection.style.display = 'none';
        
        // Add animation
        form.style.animation = 'shake 0.5s';
        setTimeout(() => {
            form.style.animation = '';
        }, 500);
    }
});

// Quick fill functionality
document.querySelectorAll('.btn-quick-fill').forEach(btn => {
    btn.addEventListener('click', function() {
        const profile = this.dataset.profile;
        
        if (profile === 'high-interest') {
            // High interest customer profile
            document.getElementById('gender').value = '1';
            document.getElementById('age').value = '35';
            document.getElementById('driving_license').value = '1';
            document.getElementById('region_code').value = '28';
            document.getElementById('previously_insured').value = '0';
            document.getElementById('annual_premium').value = '30000';
            document.getElementById('policy_sales_channel').value = '152';
            document.getElementById('vintage').value = '150';
            document.getElementById('vehicle_age').value = 'gt_2';
            document.getElementById('vehicle_damage').value = '1';
        } else if (profile === 'low-interest') {
            // Low interest customer profile
            document.getElementById('gender').value = '0';
            document.getElementById('age').value = '42';
            document.getElementById('driving_license').value = '1';
            document.getElementById('region_code').value = '15';
            document.getElementById('previously_insured').value = '1';
            document.getElementById('annual_premium').value = '25000';
            document.getElementById('policy_sales_channel').value = '26';
            document.getElementById('vintage').value = '200';
            document.getElementById('vehicle_age').value = 'lt_1';
            document.getElementById('vehicle_damage').value = '0';
        }
        
        // Add success animation
        this.style.animation = 'pulse 0.5s';
        setTimeout(() => {
            this.style.animation = '';
        }, 500);
    });
});

// Handle form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Show loading state
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';
    form.querySelector('.submit-btn').disabled = true;
    
    try {
        // Get form data
        const formData = new FormData(form);
        
        // Handle vehicle age conversion
        const vehicleAge = formData.get('vehicle_age');
        let vehicleAgeLt1Year = 0;
        let vehicleAgeGt2Years = 0;
        
        if (vehicleAge === 'lt_1') {
            vehicleAgeLt1Year = 1;
        } else if (vehicleAge === 'gt_2') {
            vehicleAgeGt2Years = 1;
        }
        
        // Prepare data for API
        const data = {
            gender: parseInt(formData.get('gender')),
            age: parseInt(formData.get('age')),
            driving_license: parseInt(formData.get('driving_license')),
            region_code: parseInt(formData.get('region_code')),
            previously_insured: parseInt(formData.get('previously_insured')),
            annual_premium: parseFloat(formData.get('annual_premium')),
            policy_sales_channel: parseInt(formData.get('policy_sales_channel')),
            vintage: parseInt(formData.get('vintage')),
            vehicle_age_lt_1_year: vehicleAgeLt1Year,
            vehicle_age_gt_2_years: vehicleAgeGt2Years,
            vehicle_damage_yes: parseInt(formData.get('vehicle_damage'))
        };
        
        // Make API call
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Prediction failed');
        }
        
        const result = await response.json();
        
        // Display result
        displayResult(result);
        
        // Scroll to result
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
    } catch (error) {
        console.error('Error:', error);
        displayError('Failed to make prediction. Please try again.');
    } finally {
        // Reset button state
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
        form.querySelector('.submit-btn').disabled = false;
    }
});

function displayResult(result) {
    const isInterested = result.prediction === 1;
    const recommendation = result.recommendation;
    
    const icon = isInterested ? '✅' : '❌';
    const badgeClass = isInterested ? 'prediction-interested' : 'prediction-not-interested';
    const primaryColor = isInterested ? '#11998e' : '#eb3349';
    
    const html = `
        <div class="prediction-result" style="animation: slideInRight 0.6s ease-out;">
            <div class="prediction-icon" style="animation: scaleIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);">${icon}</div>
            <h2 class="prediction-title" style="animation: fadeIn 0.6s 0.2s both;">Prediction Result</h2>
            <div class="prediction-badge ${badgeClass}" style="animation: scaleIn 0.6s 0.3s both;">
                ${result.prediction_text}
            </div>
            <p class="prediction-message" style="animation: fadeIn 0.6s 0.4s both;">
                ${isInterested ? 
                    '🎯 This customer is predicted to have a <strong>high interest</strong> in purchasing vehicle insurance. Great opportunity for conversion!' :
                    '⚠️ This customer is predicted to have <strong>low interest</strong> in purchasing vehicle insurance at this time. Follow alternative approach.'}
            </p>
            
            <div class="recommendations" style="animation: slideUp 0.6s 0.5s both; border-left-color: ${primaryColor};">
                <h3 style="color: ${primaryColor};">
                    <span style="font-size: 1.5em; margin-right: 10px;">${isInterested ? '🚀' : '💡'}</span>
                    ${recommendation.title}
                </h3>
                <p style="margin-bottom: 20px; color: var(--text-secondary); font-size: 1.05em; line-height: 1.6;">
                    ${recommendation.message}
                </p>
                <div style="background: rgba(102, 126, 234, 0.05); padding: 20px; border-radius: 12px; margin-bottom: 15px;">
                    <h4 style="margin-bottom: 12px; color: var(--text-primary); font-size: 1.1em;">📋 Recommended Actions:</h4>
                    <ul style="list-style: none; padding: 0;">
                        ${recommendation.actions.map((action, index) => `
                            <li style="animation: slideRight 0.4s ${0.6 + index * 0.1}s both;">
                                <span style="color: ${primaryColor}; font-weight: bold; margin-right: 8px;">▸</span>
                                ${action}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%); border-radius: 15px; border: 2px solid rgba(102, 126, 234, 0.2); animation: fadeIn 0.6s 0.7s both;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; text-align: center;">
                    <div>
                        <div style="font-size: 0.85em; color: var(--text-secondary); margin-bottom: 5px;">Model Accuracy</div>
                        <div style="font-size: 1.8em; font-weight: 800; background: var(--primary-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">92.20%</div>
                    </div>
                    <div>
                        <div style="font-size: 0.85em; color: var(--text-secondary); margin-bottom: 5px;">F1-Score</div>
                        <div style="font-size: 1.8em; font-weight: 800; background: var(--success-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">93.16%</div>
                    </div>
                    <div>
                        <div style="font-size: 0.85em; color: var(--text-secondary); margin-bottom: 5px;">Training Data</div>
                        <div style="font-size: 1.8em; font-weight: 800; color: var(--text-primary);">381K</div>
                    </div>
                </div>
                <p style="margin-top: 15px; font-size: 0.85em; color: var(--text-secondary); text-align: center; font-style: italic;">
                    Powered by Random Forest Classifier with advanced ensemble learning
                </p>
            </div>
        </div>
    `;
    
    resultContent.innerHTML = html;
    resultSection.style.display = 'block';
}

function displayError(message) {
    const html = `
        <div class="error-message">
            <strong>Error:</strong> ${message}
        </div>
    `;
    
    resultContent.innerHTML = html;
    resultSection.style.display = 'block';
}

// Form validation helpers
document.getElementById('age').addEventListener('input', function() {
    if (this.value < 18) {
        this.value = 18;
    } else if (this.value > 100) {
        this.value = 100;
    }
});

document.getElementById('annual_premium').addEventListener('input', function() {
    if (this.value < 0) {
        this.value = 0;
    }
});

document.getElementById('vintage').addEventListener('input', function() {
    if (this.value < 0) {
        this.value = 0;
    } else if (this.value > 400) {
        this.value = 400;
    }
});

// Add smooth animations on page load
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.form-section').style.animation = 'fadeIn 0.6s ease';
});
