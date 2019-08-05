$(document).ready(function () {
    // Question array
    var questions = [
        'I enjoy a nice orgy after a long workday',
        'I am extraordinarily cynical.',
        'I have a poor grip on reality.',
        'I can\'t get enough attention.',
        'Aliens run the world from Area 51.',
        'The new tattoos are not having any tattoos.',
        'Snozberries taste like snozberries.',
        'I let all of my ferrets sleep in my bed at night.',
        'I live in a van down by the river.',
        'Anyone who rejects me is a narcissist.'
    ];

    // Choices for personality
    var choices = [
        '1 (Strongly Disagree)',
        '2 (Disagree)',
        '3 (Neutral)',
        '4 (Agree)',
        '5 (Strongly Agree)'
    ];

    // Identify div where questions will be inserted and initialize counter to 0
    var questionDiv = $('#questions');
    i = 0;

    // Make a div for each question
    questions.forEach(function (question) {
        i++;
        // Fill that div with a header, the question, and the choices
        var item = $('<div class="question">');
        var headline = $('<h4>').text('Question ' + i);
        var questionText = $('<p>').text(question);
        var dropDown = $('<div class="form-group">');
        var select = $('<select class="form-control selector">');
        // Create an option for each choice
        choices.forEach(function (choice) {
            var option = $('<option>').text(choice);
            select.append(option);
        });
        select.attr('id', 'select' + i);
        // Add the dropdown to the item, then add the item to the questions div
        dropDown.append(select);
        item.append(headline, questionText, dropDown);
        var br = $('<br>');
        questionDiv.append(item, br);
    });

    // Form event handler
    $('#submit').on('click', function (event) {

        // Prevent reload
        event.preventDefault();

        // Capture username and image link values
        var userName = $('#userName').val();
        var imageLink = $('#imageLink').val();

        // If both of those items were filled out, gather other answers and submit
        if (userName.length > 0 && imageLink.length > 0) {
            var answers = [];

            // Add the response for each selector to the array of answers
            Object.keys($('.selector')).forEach(function (key) {
                if (answers.length < questions.length) {
                    answers.push($('.selector')[key].value.charAt(0));
                }
            });

            // Put the data in object form
            var surveyData = {
                name: userName,
                photo: imageLink,
                answers: answers
            };

            // POST that data to /api/friends
            $.post('/api/friends', surveyData, function (data) {

                // Use data callback to display result
                if (data) {

                    // Empty out modal and username and link fields
                    $('#modalContent').empty();
                    $('#userName').val('');
                    $('#imageLink').val('');

                    // The results are in array form. For each object, grab the name and URL
                    data.forEach(function (profile) {
                        var profileDiv = $('<div class="profile">');
                        var name = profile.name;
                        var photoURL = profile.photo;
                        // Put the name in a header
                        var nameHeader = $('<h3>').text(name);
                        // Add a photo with an 'src' of the photoURL submitted
                        var photo = $('<img>').attr('src', photoURL);
                        profileDiv.append(nameHeader, photo);

                        // Add these items to the modal
                        $('#modalContent').append(profileDiv);
                    });

                    // If there is a tie for the best match and so you have more than one
                    if (data.length > 1) {
                        // Make sure the header is plural
                        $('.modal-title').text('They\'re just like you!');
                    } else {
                        // Make sure the header is singular
                        $('.modal-title').text('Love at first sight!');
                    }

                    // Display the result modal
                    $('#resultModal').modal();
                }
            });
            // If either name or URL is missing, show the error modal
        } else {
            $('#errorModal').modal();
            // The error modal can be dismissed but it will also disappear after 2 seconds
            setTimeout(function () {
                $('#errorModal').modal('hide');
            }, 2000);
        }
    });
});
