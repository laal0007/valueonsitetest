jQuery(function ($) {
    init();
});

let additionalRowCount = 3;
const rowLimit = 5;
let baseIndex = 3;

function init() {
    if (!localStorage.getItem('AgreedToTerms') || localStorage.getItem('AgreedToTerms') === 'false') {
        localStorage.setItem('AgreedToTerms', 'false');
        $('#abbreviatedDemo').show();
        $('#fullDemo').remove();
    } else {
        $('#abbreviatedDemo').remove();
        $('#fullDemo').show();
    }

    $('#reset_button').on('click', ResetTable);

    $('#add_row_button').on('click', AddRow);
    $('body').on('click', '[id*=_delete]', function (event) {
        RemoveRow(event);
    });
    $('#calculate_button').on('click', Calculate);

    // $('#sort_button').on('click', Sort);

    $('#saveTerms').on('click', AgreeToTerms);
    $('#cancelTerms').on('click', CloseTerms);
    $('#closeModal').on('click', CloseTerms);

    $('#scenario-save-button').on('click', SaveScenario);
    $('#scenario-delete-button').on('click', DeleteScenario);

    $('#row_0_delete').hide();
    $('#row_1_delete').hide();
    $('#row_2_delete').hide();
    $('#row_3_delete').hide();

    $('#demo_table').on("mouseenter", '.set-base',
        function () {
            $(this).children().removeClass('btn-grey');
            $(this).children().addClass('btn-green');
        }).on("mouseleave", '.set-base',
            function () {
                if ($(this).children().attr('data-base') === 'false') {
                    $(this).children().removeClass('btn-green');
                    $(this).children().addClass('btn-grey');
                }
            });

    $('#demo_table').on("mouseenter", '.delete-box',
        function () {
            $(this).children().removeClass('btn-grey');
            $(this).children().addClass('btn-red');
        }).on("mouseleave", '.delete-box',
            function () {
                $(this).children().removeClass('btn-red');
                $(this).children().addClass('btn-grey');
            });


    $('#demo_table').on("click", '.set-base', SetBase);

    if (localStorage.getItem('Scenarios')) {
        const dropdown = $('#scenario-list');
        const listOfScenarios = JSON.parse(localStorage.getItem('Scenarios'));
        listOfScenarios.forEach(function (scenario, i) {
            dropdown.append(`<li id="scenario_item_${i}" class="saved-scenario">
                ${Object.keys(scenario)[0]}
                <button id="delete_scenario_${i}" type="button" class="hidden-delete-button">
                 <i class="fa fa-times" aria-hidden="true"></i>
                </button>
                </li>`);
        });
    }

    $(document).on('click', '.hidden-delete-button', function () {
        const row = $(this).attr('id').slice($(this).attr('id').length - 1);
        DeleteScenario(row);
    });


    $(document).on('click', '.saved-scenario', function () {
        ResetTable();
        const scenarioName = $(this)[0].innerText;
        const index = $('.saved-scenario').index(this);

        if (index !== -1) {

            const listOfScenarios = JSON.parse(localStorage.getItem('Scenarios'));
            const scenarioRowCount = listOfScenarios[index][scenarioName].length;

            const currentRowCount = $('tr[id^=row_]').length;

            if (scenarioRowCount < currentRowCount) {
                const diff = currentRowCount - scenarioRowCount;
                for (let i = 0; i < diff; i++) {
                    $('tr[id^=row_]').last().remove();
                }
            } else if (scenarioRowCount > currentRowCount) {
                const diff = scenarioRowCount - currentRowCount;
                for (let i = 0; i < diff; i++) {
                    AddRow();
                }
            }

            LoadScenario(scenarioName, index);
        }
    });



    let savedScenarios = Array();
    if (localStorage.getItem('Scenarios')) {
        savedScenarios = JSON.parse(localStorage.getItem('Scenarios'));
    }
    ToggleSaveScenario(savedScenarios);
}


function ResetTable() {
    // console.log('ResetTable');
    $('#demo_table tr td').find("input").each(function () {
        const item = $(this)[0];
        item.value = '';
    });
    $('#price-weight').val('');


    if ($('tr[id^=row_]').length <= 3) {
        AddRow();
        $('button[id*=_base]').last().addClass('btn-green');
    } else if ($('tr[id^=row_]').length > 4) {
        $('tr[id^=row_]').last().remove();
        ResetTable();
    }

    $('#add_row_button').prop('disabled', false);


    // remove base_row from all rows
    $('tr[id^=row_]').each(function () {
        $(this).removeClass('base_row');
    });

    // reset all data-base attributes
    $('button[id*=_base]').each(function () {
        $(this).attr('data-base', 'false');
        $(this).removeClass('btn-green');
        $(this).addClass('btn-grey');
    });

    $('#row_' + 3).addClass('base_row');
    $('#row_' + 3 + '_base').attr('data-base', 'true');
    $('#row_' + 3 + '_base').removeClass('btn-grey');
    $('#row_' + 3 + '_base').addClass('btn-green');
}


function LoadScenario(scenarioName, index) {
    const listOfScenarios = JSON.parse(localStorage.getItem('Scenarios'));
    const selectedScenarioRows = listOfScenarios[index][scenarioName];
    const listOfInputs = $('input[id^=row_]').toArray();

    let counter = 0;
    for (let i = 0; i < selectedScenarioRows.length; i++) {
        const row = selectedScenarioRows[i];

        listOfInputs[counter].value = (row.item);
        counter++;
        listOfInputs[counter].value = (row.quality);
        counter++;
        listOfInputs[counter].value = (row.price);
        counter++;
        listOfInputs[counter].value = (row.relative);
        counter++;

        $('#price-weight').val(row.priceWeight);

        if (row.isBase) {
            SetBase(null, i);
            baseIndex = parseInt(i);
        }
    }
}

/**
 * Save a Scenario to the list
 */
function SaveScenario() {

    // Ignore whitespace
    const scenarioTitle = $('#scenario-title').val().trim();
    if (scenarioTitle == '' || scenarioTitle === null || scenarioTitle.trim() === '') {
        return;
    }
    const priceWeight = $('#price-weight').val().trim();

    let allInputsComplete = true;
    $('#demo_table tr td').find("input").each(function () {
        const item = $(this)[0];
        if (!item.id.includes('output')) {
            item.value = item.value.trim();
            if (!item.value) {
                allInputsComplete = false;
            }
        }
    });

    if (!priceWeight) {
        allInputsComplete = false;
    }

    if (!allInputsComplete) {
        alert('All Inputs must contain a value.')
    } else {
        // Push new Scenario Name and Values
        let savedScenarios = Array();
        if (localStorage.getItem('Scenarios')) {
            savedScenarios = JSON.parse(localStorage.getItem('Scenarios'));
        } else {
            savedScenarios = [];
        }

        const inputs = $('#demo_table tr td').find("input");

        let scenario = {
            [scenarioTitle]: []
        };
        let counter = 0;
        for (let i = 0; i < inputs.length; i += 4) {
            scenario[scenarioTitle].push({
                item: inputs[i].value,
                quality: inputs[i + 1].value,
                price: inputs[i + 2].value,
                priceWeight: priceWeight,
                isBase: counter === baseIndex ? true : false,
                relative: inputs[i + 3].value
            });
            counter++;
        }

        savedScenarios.push(scenario);
        localStorage.setItem('Scenarios', JSON.stringify(savedScenarios));
        ToggleSaveScenario(savedScenarios);

        // Create new List Item
        const dropdown = $('#scenario-list');
        const listOfScenarios = JSON.parse(localStorage.getItem('Scenarios'));
        dropdown.append(`<li id="scenario_item_${listOfScenarios.length - 1}" class="saved-scenario">
         ${scenarioTitle}
        <button id="delete_scenario_${listOfScenarios.length - 1}" type="button" class="hidden-delete-button">
            <i class="fa fa-times" aria-hidden="true"></i>
        </button>
        </li>`);

        $('#scenario-title').val('');
    }
}

/**
 * Enable/Disable the Save Scenario input and button
 * @param {*} savedScenarios  List of saved scenarios
 */

function ToggleSaveScenario(savedScenarios) {
    if (savedScenarios.length >= 7) {
        $('#scenario-save-button').prop('disabled', true);
        $('#scenario-title').prop('disabled', true);
    } else {
        $('#scenario-save-button').prop('disabled', false);
        $('#scenario-title').prop('disabled', false);
    }
}

/**
 * Deletes a Scenario from the list
 * @param {*} i index to delete
 */
function DeleteScenario(i) {
    $('#scenario_item_' + i).remove();

    let savedScenarios = JSON.parse(localStorage.getItem('Scenarios'));
    savedScenarios.splice(i, 1);
    localStorage.setItem('Scenarios', JSON.stringify(savedScenarios));

    ToggleSaveScenario(savedScenarios);
}

function AgreeToTerms() {
    localStorage.setItem('AgreedToTerms', 'true');
    CloseTerms();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    location.reload();
}

function CloseTerms() {
    $("#exampleModalLong").modal('hide');
}

function AddRow() {
    // console.log('AddRow');

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
    $(row).find('#row_0_base').attr('id', 'row_' + additionalRowCount + '_base');

    // Add that new row to the end of the table
    $(row).insertAfter($('#demo_table tbody tr:last'));
    $('#row_' + additionalRowCount + '_delete').show();

    if ($('tr[id^=row_]').length > rowLimit) {
        $('#add_row_button').prop('disabled', true);
        return;
    } else {
        $('#add_row_button').prop('disabled', false);
    }
}



function SetBase(event, index) {
    // Get the Index for the set Base Button that was clicked
    if (index === '' || index === null || index === undefined) {
        if (event.target.id) {
            index = event.target.id.split('_')[1];
        }
        else {
            index = event.target.parentElement.id.split('_')[1];
        }
    }

    baseIndex = parseInt(index);

    // remove base_row from all rows
    $('tr[id^=row_]').each(function () {
        $(this).removeClass('base_row');
    });

    // reset all data-base attributes
    $('button[id*=_base]').each(function () {
        $(this).attr('data-base', 'false');
        $(this).removeClass('btn-green');
        $(this).addClass('btn-grey');
    });

    $('#row_' + index).addClass('base_row');
    $('#row_' + index + '_base').attr('data-base', 'true');
    $('#row_' + index + '_base').removeClass('btn-grey');
    $('#row_' + index + '_base').addClass('btn-green');
}

function RemoveRow(event) {
    // console.log('RemoveRow');

    if ($('tr[id^=row_]').length > rowLimit) {
        $('#add_row_button').prop('disabled', false);
    }

    // Get the Index for the Remove Button that was clicked
    var index = null;
    if (event.target.id) {
        index = event.target.id.split('_')[1];
    }
    else {
        index = event.target.parentElement.id.split('_')[1];
    }

    // Get the Row that was clicked
    var row = $('#row_' + index)[0];

    // Remove it from the table
    row.remove();

    // reset the Base if it was deleted
    if ($(row).hasClass('base_row')) {
        $('tr[id^=row_]').last().addClass('base_row');
        $('button[id*=_base]').last().removeClass('btn-grey');
        $('button[id*=_base]').last().addClass('btn-green');
        $('button[id*=_base]').last().attr('data-base', 'true');
    }
}

function Calculate() {

    const priceWeight = $('#price-weight').val().trim();
    let allInputsComplete = true;
    $('#demo_table tr td').find("input").each(function () {
        const item = $(this)[0];
        if (!item.id.includes('output')) {
            if (!item.value) {
                allInputsComplete = false;
            }
        }
    });

    if (!priceWeight) {
        allInputsComplete = false;
    }

    if (!allInputsComplete) {
        alert('All Inputs must contain a value.')
    } else {

        let counter = 10;
        $('#calculate_button').prop('disabled', true);
        const timer = setInterval(() => {
            $('#calculate_button')[0].innerText = counter;
            counter--;
            if (counter < 0) {
                clearInterval(timer);
                $('#calculate_button')[0].innerText = 'Calculate';
                $('#calculate_button').prop('disabled', false);
            }
        }, 1000);


        const listOfValues = $('input[id^=row_]:enabled').map(function () {
            return this.value;
        }).get();

        const size = 3;
        const arrayOfArrays = [];
        for (var i = 0; i < listOfValues.length; i += size) {
            arrayOfArrays.push(listOfValues.slice(i, i + size));
        }

        const data = [];
        for (let i = 0; i < arrayOfArrays.length; i++) {
            const item = arrayOfArrays[i];
            const record = {
                name: item[0],
                quality: parseFloat(item[1]),
                price: parseFloat(item[2]),
                priceWeight: parseFloat(priceWeight),
                isBase: i === baseIndex ? true : false,
                relative: 0
            };
            data.push(record);
        }


        const serviceUrl = 'https://dqsrnskzi2.execute-api.us-east-1.amazonaws.com/default/cors-test';
        const stringData = JSON.stringify(data);

        JSON.parse(stringData);

        $.ajax({
            method: 'POST',
            url: serviceUrl,
            contentType: 'application/json',
            data: stringData,
            headers: {
                "x-api-key": 'HRDtCwhGkUQgMriAEnO620zGUGoZFjc2T6UQ8Pvg'
            },
            success: function (data) {
                console.info('success - ', data);

                const results = JSON.parse(data);

                for (let i = 0; i < results.length; i++) {
                    const item = results[i];
                    $('#row_' + i + '_output').val(item);
                }

                Sort();
            },
            error: function (data) {
                // console.info('error - ', data);
                alert('There was an error with your request, please try again.');
            }
        });
    }
}

function Sort() {

    const listOfValues = $('input[id^=row_]').map(function () {
        return this.value;
    }).get();

    const size = 4;
    const arrayOfArrays = [];
    for (var i = 0; i < listOfValues.length; i += size) {
        arrayOfArrays.push(listOfValues.slice(i, i + size));
    }

    arrayOfArrays[baseIndex].isBase = true;

    console.log(arrayOfArrays.sort((a,b) => b[3] - a[3]));

    const listOfInputs = $('input[id^=row_]').toArray();

    let counter = 0;
    for (let i = 0; i < arrayOfArrays.length; i++) {
        const row = arrayOfArrays[i];

        listOfInputs[counter].value = (row[0]);
        counter++;
        listOfInputs[counter].value = (row[1]);
        counter++;
        listOfInputs[counter].value = (row[2]);
        counter++;
        listOfInputs[counter].value = (row[3]);
        counter++;

        if (row.isBase) {
            SetBase(null, i);
        }
    }

    $('.output-value').delay(100).fadeOut().fadeIn('slow');

}
