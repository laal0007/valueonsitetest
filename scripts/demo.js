jQuery(function () {
    init();
});
var rowCount = 1;
function init() {
    console.log('inti');
    $('#add_row_button').on('click', AddRow);
    $('body').on('click', '[id^=delete_]', function (event) {
        RemoveRow(event);
    });
    $('#calculate_button').on('click', Calculate);
}
function AddRow() {
    console.log('AddRow');
    rowCount++;
    // Create a copy of the first row
    var row = $('#row_0')[0].cloneNode(true);
    // Clear out any existing values
    $(row).find('input').val('');
    // Update the new Row Id
    $(row).attr('id', 'row_' + rowCount);
    console.log(rowCount);
    // Update the new Row Delete Button Id
    $($(row).children().last()[0]).children().attr('id', 'delete_' + rowCount);
    // $('#row_0')[0].lastChild
    // Add that new row to the end of the table
    $(row).insertAfter($('#demo_table tbody tr:last'));
}
function RemoveRow(event) {
    console.log('RemoveRow');
    // Get the Index for the Remove Button that was clicked
    var index = null;
    if (event.target.id) {
        index = event.target.id.slice(6)[1];
    }
    else {
        index = event.target.parentElement.id.slice(6)[1];
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
    var serviceUrl = 'https://0jy9cqz7l7.execute-api.us-east-1.amazonaws.com/dev/simple-test';
    var data = [
        {
            "id": 1,
            "name": "WEBER",
            "input1": 1,
            "input2": 2,
            "input3": 3,
            "input4": 4,
            "input5": 5,
            "input6": 6
        },
        {
            "id": 2,
            "name": "NEXGRILL",
            "input1": 2,
            "input2": 4,
            "input3": 6,
            "input4": 8,
            "input5": 10,
            "input6": 12
        },
        {
            "id": 3,
            "name": "CHAR-BROIL",
            "input1": 1,
            "input2": 3,
            "input3": 5,
            "input4": 7,
            "input5": 9,
            "input6": 11
        },
        {
            "id": 4,
            "name": "TRAEGER",
            "input1": 3,
            "input2": 4,
            "input3": 5,
            "input4": 6,
            "input5": 7,
            "input6": 8
        },
        {
            "id": 5,
            "name": "COLEMAN",
            "input1": 10,
            "input2": 20,
            "input3": 30,
            "input4": 40,
            "input5": 50,
            "input6": 60
        }
    ];
    var stringData = JSON.stringify(data);
    $.post(serviceUrl, function (stringData, status) {
        alert("Data: " + items + "\nStatus: " + status);
    });
}
