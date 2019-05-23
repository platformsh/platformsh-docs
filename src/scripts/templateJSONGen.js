module.exports = generate;


'use strict';


function generate(){
    const fs = require('fs');

    let student = {
        name: 'Mike',
        age: 23,
        gender: 'Male',
        department: 'English',
        car: 'Honda'
    };

    let data = JSON.stringify(student);
    fs.writeFileSync('student-2.json', data);
}
