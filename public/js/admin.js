
const BASE_URL = 'http://localhost:3000'

/**
 * Get user Data to fill table, DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', async function() {
    const response = await axios.get(`${BASE_URL}/users`);
    // Display the raw JSON data on the webpage
    for(let user of response.data){
        $('#userlist').append( `
            <tr id='${user.id}'>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>${user.email}</td>
                <td>${user.state}</td>
                <td><button id='edit'>EDIT</button></td>
            </tr>
        `);
    }
});

/**
 * Generate form to edit user
 */
$(function(){
    $('body').on('click', '#edit', function(){
        const id = $(this).parent().parent().attr('id');
        
        axios.get(`${BASE_URL}/users/${id}`)
        .then(function ({data}) {
            $('#profile').empty()
                .append(`
                    <form id="editForm" action="/users/${id}" method="PUT">
                        <h2>Edit User</h2>
                    
                        <label for="firstName">First Name:</label>
                        <input type="text" id="firstName" name="firstName" value='${data.firstName}'></br>
                    
                        <label for="lastName">Last Name:</label>
                        <input type="text" id="lastName" name="lastName" value='${data.lastName}'></br>
                    
                        <label for="email">Email:</label>
                        <input type="email" id="email" name="email" value='${data.email}'></br>

                        <label for="state">State:</label>
                        <select id="state" name="state">
                            <option ${data.state === 'pending' ? 'selected' : ''} value="pending">Pending</option>
                            <option ${data.state === 'active' ? 'selected' : ''} value="active">Active</option>
                        </select></br>
                    
                        <button id='update-user'>Update</button>
                        <button id='delete-user'>Delete</button>
                    </form>`
            );
            setupButtonHandlers(id)
        })
        .catch(function (error) {
            console.error(error);
        });
    })
})


/** setupButtonHandlers
 * handle the makeEditForm Update and Delete buttons
*/
function setupButtonHandlers(id) {
    
    /** putUser
     * Update a specific user's data by completely replacing the data
     * & update the page's rows to reflect this update
     */
    const putUser = async (data, id)=>{
        try{
            await axios.put(`${BASE_URL}/users/${id}`, data)

            let targetRow = $(`#userlist tr#${id}`)
            targetRow.find('td:eq(0)').text(`${data.firstName}`)
            targetRow.find('td:eq(1)').text(`${data.lastName}`)
            targetRow.find('td:eq(2)').text(`${data.email}`)
            targetRow.find('td:eq(3)').text(`${data.state}`)
            $(`#profile`).empty().append(` <p id="updated">USER ${id} UPDATED!<p> `)
        }catch(err){
            console.error(err)
        }
    }
    /** deleteUser
     * Update a specific user's data by completely replacing the data
     * & update the page's rows to reflect this update
     */
    const deleteUser = async (id)=>{
        try{
            await axios.delete(`${BASE_URL}/users/${id}`)
            $(`#userlist tr#${id}`).remove()
            $(`#profile`).empty().append(` <p id="deleted">USER ${id} DELETED!<p> `)
        }catch(err){
            console.error(err)
        }
    }

    /**
     * update-user button pressed
     *      Updates entry from "database"
     */
    $('#update-user').on('click', function (e) {
        e.preventDefault();
        // Get data from the form
        let formData = new FormData(e.target.parentNode);
        let data = {id};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        // Update user's data in 'database'
        putUser(data, id);
    });

    /**
     * delete-user button pressed
     *      Deletes entry from "database"
     */
    $('#delete-user').on('click', function (e) {
        e.preventDefault();
        deleteUser(id);
    });
}
