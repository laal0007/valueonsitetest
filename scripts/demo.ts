
jQuery(function () {
    init();
});

let rowCount = 1;

function init() {
    console.log('init');

    $('#add_row_button').on('click', AddRow);

    $('body').on('click', '[id^=delete_]', function (event) {
        RemoveRow(event);
    });

    $('#calculate_button').on('click', Calculate);
}

function AddRow() {
    console.log('AddRow');

    additionalRowCount++;

    // Create a copy of the first row
    const row = $('#row_0')[0].cloneNode(true) as HTMLElement;

    // Clear out any existing values
    $(row).find('input').val('');

    // Update the new Row Id
    $(row).attr('id', 'row_' + additionalRowCount);

    console.log(additionalRowCount);
    // Update the new Row Delete Button Id
    $($(row).children().last()[0]).children().attr('id', 'delete_' + additionalRowCount);

    // $('#row_0')[0].lastChild

    // Add that new row to the end of the table
    $(row).insertAfter($('#demo_table tbody tr:last'));
}

function RemoveRow(event) {
    console.log('RemoveRow');

    // Get the Index for the Remove Button that was clicked
    let index = null;
    if (event.target.id) {
        index = event.target.id.slice(6)[1];
    } else {
        index = event.target.parentElement.id.slice(6)[1];
    }

    // Get the Row that was clicked
    const row = $('#row_' + index)[0];

    // Remove it from the table
    row.remove();
}

function Calculate() {
    const rows = $('#demo_table tbody').children();

    let item = {
        id: "",
        name: "",
        input1: 0,
        input2: 0,
        input3: 0,
        output1: 0,
        output2: 0
    }

    const items = Array(item);

    rows.each(function (index, value) {

        const input = $(value).find('input');

        const id = "id" + index;
        const name = $(input[0]).val() as string;
        const input1 = $(input[1]).val() as number;
        const input2 = $(input[2]).val() as number;
        const input3 = $(input[3]).val() as number;
        const output1 = $(input[4]).val() as number;
        const output2 = $(input[5]).val() as number;

        item = {
            id: id,
            name: name,
            input1: input1,
            input2: input2,
            input3: input3,
            output1: output1,
            output2: output2,
        }

        items.push(item);
    });

    const serviceUrl = 'https://dqsrnskzi2.execute-api.us-east-1.amazonaws.com/default/cors-test';
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

      const data = {
        "key1": "value1",
        "key2": "value2",
        "key3": "value3"
      };

      const stringData = JSON.stringify(data);

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
