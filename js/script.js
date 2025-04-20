let tags = [];
let finallyInputValueArray = []
let listTag = document.querySelector('.list-tag')
let inputTag = document.querySelector('.input-tag')
let removeAllBtn = document.querySelector('.removeAll-btn')
let currentLi = 0
let allowedCount, c

function resetInput(){
    inputTag.value = ''
    inputTag.focus()
}

function trimCommas(str) {
    // حذف ویرگول‌ها از ابتدا و انتهای رشته
    return str.replace(/^[\s,]+|[\s,]+$/g, '').trim();
}
function removeTag(tag, text){
    let index = tags.findIndex(function (item){
        return item === text
    })
    tags.splice(index, 1); // حذف آیتم از آرایه
    localStorage.setItem("localTags", JSON.stringify(tags));
    tag.parentElement.remove()
    currentLi--;
    document.querySelector('span').innerText = String(10 - currentLi)
    resetInput()
}
function addTextToTag(text){
    tags.push(text)
    let newLI = document.createElement('li')
    newLI.innerHTML = `
                ${text}
                <i class="uit uit-multiply"" onclick="removeTag(this, '${text}')"></i>
            `
    listTag.insertBefore(newLI, inputTag);
    currentLi++

}
inputTag.addEventListener('keyup', event => {
    if (event.keyCode === 13) {
        finallyInputValueArray = []
        let inputValue = event.target.value
        inputValue = trimCommas(inputValue)  // حذف ویرگول‌ها از ابتدا و انتها
        console.log("Trimmed Value: ", inputValue)

        // حالا رشته را بر اساس ویرگول‌ها تقسیم می‌کنیم و فضاهای اضافی را حذف می‌کنیم
        let inputValueArray = inputValue.split(',')
        inputValueArray = inputValueArray.map(item => item.trim())  // حذف فضای اضافی در هر قسمت

        // حذف آیتم‌های تکراری
        let uniqueInputValueArray = [...new Set(inputValueArray)]

        // اضافه کردن مقادیر جدید به آرایه نهایی فقط در صورتی که در آرایه tags وجود نداشته باشد
        uniqueInputValueArray.forEach(function (item) {
            if (!tags.includes(item.toLowerCase())) {
                finallyInputValueArray.push(item)
            }
        })
        console.log("Unique Values: ", finallyInputValueArray)
        allowedCount = 10 - currentLi
        console.log(allowedCount)
        if (finallyInputValueArray.length >= allowedCount){
            c = allowedCount
        }else {
            c = finallyInputValueArray.length
        }
        for (let i = 0; i < c; i++) {
            addTextToTag(finallyInputValueArray[i].toLowerCase())
        }
        localStorage.setItem("localTags", JSON.stringify(tags));
        document.querySelector('span').innerText = String(10 - currentLi)
        if (finallyInputValueArray.length !== uniqueInputValueArray.length){
            Swal.fire({
                icon: 'warning',
                title: 'You are not allowed to enter duplicate items!',
                text: 'Duplicate item will be automatically removed.',
                customClass: {
                    title: 'swal-title',
                    icon: 'swal-icon',
                    content: 'swal-content',
                    confirmButton: 'swal-confirm-button'
                }
            });

        }
        resetInput()
        console.log(tags)
    }
})
removeAllBtn.addEventListener('click' , ()=> {
    let liTags = Array.from(document.querySelectorAll('li'))
    liTags.forEach(function (liTag){
        liTag.remove()
    })
    tags = []
    localStorage.setItem("localTags", JSON.stringify(tags));
    currentLi = 0
    document.querySelector('span').innerText = String(10)
})
window.onload = function (){
    resetInput()
    const savedTags = JSON.parse(localStorage.getItem("localTags"))
    if (savedTags !== null){
        savedTags.forEach(function (item){
            addTextToTag(item)
        })
        document.querySelector('span').innerText = String(10 - currentLi)
    }else {
        console.log('empty')
    }
}
