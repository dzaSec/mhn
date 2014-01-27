$(document).ready(function() {
    if ($('#sensor-fields').length >= 1) {
        $('#create-btn').click(function() {
            var sensorObj = {
                name: $('#name').val(),
                hostname: $('#hostname').val()
            }
            $('#alert-row').hide();
            $.ajax({
                type: 'POST',
                url: '/api/sensor/',
                data: JSON.stringify(sensorObj),
                success: function(resp) {
                    $('#sensor-info').show();
                    $('#sensor-id').html('UUID: ' + resp.uuid);
                },
                contentType: 'application/json',
                error: function(resp) {
                    $('#sensor-info').hide();
                    $('#alert-row').show();
                    $('#error-txt').html(resp.responseJSON.error);
                }
            });
        });
    }

    if ($('#rule-table').length >= 1) {
        var requestChange = function(inputObj, data, success, error) {
            var ruleId = inputObj.attr('data-rule-id');

            inputObj.attr('enabled', false);
            console.log(data);
            console.log('/api/rule/' + ruleId + '/');
            $.ajax({
                type: 'PUT',
                url: '/api/rule/' + ruleId + '/',
                data: JSON.stringify(data),
                success: success,
                contentType: 'application/json',
                error: error,
                always: function(resp) {
                    inputObj.attr('enabled', true);
                }
            });
        };
        $('.checkbox').click(function() {
            var checkbox = $(this);
            var isChecked = checkbox.is(':checked');

            requestChange(
                checkbox,
                {is_active: isChecked},  // Data
                function() {},           // Success
                function() {             // Error
                    // Reverses the state.
                    checkbox.prop({checked: !isChecked});
                }
            );
        });
        $('.text-edit').focusout(function() {
            var input = $(this);
            var fieldName = input.attr('data-field-name');
            var data = new Object();

            data[fieldName] = input.val();
            requestChange(
                input,
                data,                    // Data
                function() {},           // Success
                function() {             // Error
                    // Reverses the state.
                    alert('Could not save changes.');
                }
            );
        });
    }
});
