jQuery(function () {
    init();
});

let additionalRowCount = 2;

function init() {
    console.log('init');
    if (!localStorage.getItem('AgreedToTerms') || localStorage.getItem('AgreedToTerms') === 'false') {
        localStorage.setItem('AgreedToTerms', 'false');
        $('#abbreviatedDemo').show();
        $('#fullDemo').remove();
    } else {
        $('#abbreviatedDemo').remove();
        $('#fullDemo').show();
    }

    $('#add_row_button').on('click', AddRow);
    $('body').on('click', '[id*=_delete]', function (event) {
        RemoveRow(event);
    });
    $('#calculate_button').on('click', Calculate);

    // $('#agree_check').on('change', AcceptTermsChecked);

    $('#saveTerms').on('click', AgreeToTerms);
    $('#cancelTerms').on('click', CloseTerms);
    $('#closeModal').on('click', CloseTerms);

    $('#scenario-save-button').on('click', SaveScenario);
    $('#scenario-delete-button').on('click', DeleteScenario);

    $('#row_0_delete').hide();

    if (localStorage.getItem('Scenarios')) {
        const dropdown = $('#scenario-dropdown');
        const test = JSON.parse(localStorage.getItem('Scenarios'));
        for (const scenario of test) {
            dropdown.append(`<div>            
            <button id="asdfs" type="button">
              <i class="fa fa-times" aria-hidden="true"></i>
            </button>
            <a class="dropdown-item" href="#">${scenario.name}</a>
          </div>`);
        }
        
    }

}

function SaveScenario() {

    //'{"name":"John", "age":30, "car":null}'
    let savedScenarios = [];
    if (localStorage.getItem('Scenarios')) {
        savedScenarios = JSON.parse(localStorage.getItem('Scenarios'));
    }

    if (savedScenarios !== []) {
        savedScenarios.push({ name: $('#scenario-title').val() });
    }

    localStorage.setItem('Scenarios', JSON.stringify(savedScenarios));

    const dropdown = $('#scenario-dropdown');
    dropdown.append('<a class="dropdown-item" href="#">' + $('#scenario-title').val() + '</a>');
    //<a class="dropdown-item" href="#">Scenario 1</a>
}

function DeleteScenario() {

}

// function AcceptTermsChecked() {
//     if (this.checked) {
//         $('#saveTerms').prop('disabled', false);
//     } else {
//         $('#saveTerms').prop('disabled', true);
//     }
// }

function AgreeToTerms() {
    localStorage.setItem('AgreedToTerms', 'true');
    CloseTerms();
    location.reload();
}

function CloseTerms() {
    $("#exampleModalLong").modal('hide');
}

function AddRow() {
    console.log('AddRow');
    additionalRowCount++;

    // Create a copy of the first row
    var row = $('#row_0')[0].cloneNode(true);
    // Clear out any existing values
    $(row).find('input').val('');
    // Update the new Row Id
    $(row).attr('id', 'row_' + additionalRowCount);

    // Update the new row id's
    $(row).find('#row_0_input_name').attr('id', 'row_' + additionalRowCount + '_input_name');
    $(row).find('#row_0_input_1').attr('id', 'row_' + additionalRowCount + '_input_1');
    $(row).find('#row_0_input_2').attr('id', 'row_' + additionalRowCount + '_input_2');
    $(row).find('#row_0_output').attr('id', 'row_' + additionalRowCount + '_output');
    $(row).find('#row_0_delete').attr('id', 'row_' + additionalRowCount + '_delete');
    // Add that new row to the end of the table
    $(row).insertAfter($('#demo_table tbody tr:last'));
    $('#row_' + additionalRowCount + '_delete').show();
}

function RemoveRow(event) {
    console.log('RemoveRow');
    // Get the Index for the Remove Button that was clicked
    var index = null;
    if (event.target.id) {
        index = event.target.id.slice(4, 5)[0];
    }
    else {
        index = event.target.parentElement.id.slice(4, 5)[0];
    }
    // Get the Row that was clicked
    var row = $('#row_' + index)[0];
    // Remove it from the table
    row.remove();
}

function Calculate() {
    var rows = $('#demo_table tbody').children();
    var item = {
        id: "",
        name: "",
        input1: 0,
        input2: 0,
        input3: 0,
        output1: 0,
        output2: 0
    };
    var items = Array(item);
    rows.each(function (index, value) {
        var input = $(value).find('input');
        var id = "id" + index;
        var name = $(input[0]).val();
        var input1 = $(input[1]).val();
        var input2 = $(input[2]).val();
        var input3 = $(input[3]).val();
        var output1 = $(input[4]).val();
        var output2 = $(input[5]).val();
        item = {
            id: id,
            name: name,
            input1: input1,
            input2: input2,
            input3: input3,
            output1: output1,
            output2: output2,
        };
        items.push(item);
    });
    var serviceUrl = 'https://dqsrnskzi2.execute-api.us-east-1.amazonaws.com/default/cors-test';
    // https://kdrqcecosg.execute-api.us-east-1.amazonaws.com/default/cors-test
    // https://43t6mhf3m1.execute-api.us-east-1.amazonaws.com/default/Options-PreFlight
    // const data = [
    //     {
    //       "id": 1,
    //       "name": "WEBER",
    //       "input1": 1,
    //       "input2": 2,
    //       "input3": 3,
    //       "input4": 4,
    //       "input5": 5,
    //       "input6": 6
    //     },
    //     {
    //       "id": 2,
    //       "name": "NEXGRILL",
    //       "input1": 2,
    //       "input2": 4,
    //       "input3": 6,
    //       "input4": 8,
    //       "input5": 10,
    //       "input6": 12
    //     },
    //     {
    //       "id": 3,
    //       "name": "CHAR-BROIL",
    //       "input1": 1,
    //       "input2": 3,
    //       "input3": 5,
    //       "input4": 7,
    //       "input5": 9,
    //       "input6": 11
    //     },
    //     {
    //       "id": 4,
    //       "name": "TRAEGER",
    //       "input1": 3,
    //       "input2": 4,
    //       "input3": 5,
    //       "input4": 6,
    //       "input5": 7,
    //       "input6": 8
    //     },
    //     {
    //       "id": 5,
    //       "name": "COLEMAN",
    //       "input1": 10,
    //       "input2": 20,
    //       "input3": 30,
    //       "input4": 40,
    //       "input5": 50,
    //       "input6": 60
    //     }
    //   ];
    var data = {
        "key1": "value1",
        "key2": "value2",
        "key3": "value3"
    };
    var stringData = JSON.stringify(data);
    //   fetch('url', {
    //     method: 'POST',
    //     headers: {
    //       Accept: 'text/plain',
    //       'Content-Type': 'text/plain'
    //     },
    //     body: stringData
    //   });
    $.ajax({
        method: 'POST',
        url: serviceUrl,
        dataType: 'json',
        data: data,
        headers: {
            "x-api-key": 'HRDtCwhGkUQgMriAEnO620zGUGoZFjc2T6UQ8Pvg'
        },
        // beforeSend: function (xhr) {
        //     xhr.setRequestHeader ("x-api-key", "HRDtCwhGkUQgMriAEnO620zGUGoZFjc2T6UQ8Pvg");
        //     },
        success: function (data) {
            console.info(data);
        },
        error: function (data) {
            console.info(data);
        }
    });
}
