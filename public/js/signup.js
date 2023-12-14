$("#signupForm").on("submit", function(e) {
    e.preventDefault();
    
    // Get form data
    let formData = new FormData(e.target);
    let data = {}; 
    formData.forEach((value, key)=>{
        data[key] = value;
    });
    
    // Submit data
    axios.post('/users', data)
    // Clear form values after submission
    $(this).find('input[type=text], input[type=email]').val('');
    
});
