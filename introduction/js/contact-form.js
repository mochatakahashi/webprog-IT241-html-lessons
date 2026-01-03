// Vue.js Contact Form Application
const { createApp } = Vue;

createApp({
    data() {
        return {
            formData: {
                name: '',
                email: '',
                message: ''
            },
            isSubmitting: false,
            submitMessage: '',
            submitStatus: ''
        }
    },
    methods: {
        async submitForm() {
            this.isSubmitting = true;
            this.submitMessage = '';
            
            try {
                // Prepare form data as JSON for Web3Forms
                const formData = {
                    access_key: '1e30e43a-0290-4e92-8a7b-532aaee37e5b',
                    name: this.formData.name,
                    email: this.formData.email,
                    message: this.formData.message
                };
                
                console.log('Sending data:', formData);
                
                // Send to Web3Forms API with JSON
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                console.log('Response:', result);
                
                if (result.success) {
                    this.submitMessage = 'Thank you! Your message has been received.';
                    this.submitStatus = 'success';
                    
                    // Reset form
                    this.formData = {
                        name: '',
                        email: '',
                        message: ''
                    };
                    
                    // Clear message after 5 seconds
                    setTimeout(() => {
                        this.submitMessage = '';
                    }, 5000);
                } else {
                    console.error('Web3Forms Error:', result.message);
                    this.submitMessage = result.message || 'Oops! Something went wrong. Please try again.';
                    this.submitStatus = 'error';
                }
            } catch (error) {
                console.error('Form submission error:', error);
                this.submitMessage = 'Error sending message. Please try again later.';
                this.submitStatus = 'error';
            } finally {
                this.isSubmitting = false;
            }
        }
    }
}).mount('#contactApp');
