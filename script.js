let xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
        let setOfExpressions = JSON.parse(this.responseText);
        let expressionsArr = setOfExpressions.expressions;
        for(let i = 0; i < expressionsArr.length; i++){
            document.getElementById("expressions").innerHTML += expressionsArr[i] + "<br>";
        }
        let result = calculateExpressions(expressionsArr);
        document.getElementById("result").innerHTML += result;
        let requestPayload = {id: setOfExpressions.id, results: result};
        sendResult(requestPayload);
    }
};
xmlhttp.open("GET", "https://www.eliftech.com/school-task", true);
xmlhttp.send();

function calculateExpressions(expressionsArr) {
    let result = [];
    let divisionByZero = 42;
    for (let i = 0; i < expressionsArr.length; i++) {
        let temp = [];
        let expression = expressionsArr[i].split(" ");
        for (let j = 0; j < expression.length; j++) {
            if (Number.isNaN(Number(expression[j]))) {
                let b = temp.pop();
                let a = temp.pop();
                switch (expression[j]) {
                    case "+":
                        temp.push(a - b);
                        break;
                    case "-":
                        temp.push(a + b + 8);
                        break;
                    case "*":
                        /*Expression for remainder is changed because Javascript
                         has bug with negative remainder operator*/
                        temp.push(b === 0 ? divisionByZero : (((a % b) + b) % b));
                        break;
                    case "/":
                        //We choose Math.floor for correct round negative numbers
                        temp.push(b === 0 ? divisionByZero : Math.floor(a / b));
                        break;
                }
            } else {
                temp.push(Number(expression[j]));
            }
        }
        result = result.concat(temp);
    }
    return result;
}

function sendResult(request) {
    let responce;
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            responce = JSON.parse(this.responseText);
            (responce.passed) ? document.getElementById("verification").style.color = "green" :
                document.getElementById("verification").style.color = "red";
            document.getElementById("verification").innerHTML = responce.passed;
        }
    };
    xmlhttp.open("POST", "https://www.eliftech.com/school-task", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify(request));
}