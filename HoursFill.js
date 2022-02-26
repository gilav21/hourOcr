const file = `07:42-14:43
08:31-16:55
07:40-17:27
08:27-17:27
07:41-18:56
07:39-16:27
07:40-14:40
08:29-18:58
07:43-16:22
07:42-15:58
07:41-16:57
07:40-17:27
07:39-17:27
07:39-14:43
07:39-17:28
07:40-16:28`;

let data = file.split('\n');
const entries = data.map(day => {
    const dayEntries = day.split('-');
    return {entry: dayEntries[0], exit: dayEntries[1]};
});
let numOfRows= data.length;
console.log('numOfRows:', numOfRows);
console.log('entries:', entries);

const refreshButton = document.querySelector("input[name$='RefreshSelectedDays']");

function confirmDialog(msg) {
  return new Promise(function (resolve, reject) {
    let confirmed = confirm(msg);

    return confirmed ? resolve(true) : reject(false);
  });
 }

async function fillHours() {
    const answer = prompt('Enter "yes" to start filling');
    if (answer === 'yes') {
        let entry;
        let exit;
        for (let i=0; i< numOfRows; i++) {
            project1 = document.querySelector("select[id$='ProjectStep1_EmployeeReports_row_"+ i +"_0']");
            project2 = document.querySelector("select[id$='ProjectStep2_EmployeeReports_row_"+ i +"_0']");
            project3 = document.querySelector("select[id$='ProjectStep3_EmployeeReports_row_"+ i +"_0']");
            entry = document.querySelector("input[id$='ManualEntry_EmployeeReports_row_"+ i +"_0']");
            exit = document.querySelector("input[id$='ManualExit_EmployeeReports_row_" + i + "_0']");
            
            if (entry && exit) {
                project1.selectedIndex = 2;
                project1.dispatchEvent(new Event('change'));
                await new Promise(r => setTimeout(r, 100));
                project2.selectedIndex = 1;
                project2.dispatchEvent(new Event('change'));
                await new Promise(r => setTimeout(r, 100));
                project3.selectedIndex = 1;
                project3.dispatchEvent(new Event('change'));
                entry.value = entries[i].entry;
                exit.value = entries[i].exit;
                exit.focus();
                exit.blur();       
            }
        }
    } else {
        alert('See ya later!');
    }
      
}

async function chooseWrongDays() {
    const images = document.querySelectorAll("img[src$='error.gif']");
    let imgArr = Array.from(images);
    imgArr = imgArr.filter(image => image.parentElement.parentElement.className === 'dayImageNumberContainer');
    imgArr.forEach(img => {
        img.click();
    });
    refreshButton.click();    
}

chooseWrongDays();
document.onclick = () => {
    fillHours();
    document.onclick = null;
};

