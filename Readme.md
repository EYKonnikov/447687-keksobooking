Project: Keksobooking

Keksobooking — service ad placement on lease of real estate in Central Tokyo. Users are given the opportunity to advertise their property or view already placed ads.


Description of functionality

Page States
Inactive state. When you first open the page, it is in an inactive state: the block with the card is in an inactive state, the application form is blocked.

The block to the card .map contains the map--faded class;
Form of filling information about the announcement .ad-form contains the ad-form--disabled class;
All <input> and < select> forms .ad-form is blocked by using the disabled attribute added on them or on their parent fieldset blocks.
Form with filters .map__filters blocked as well as form .ad-form.

The only action available in the inactive state is to drag the label .map__pin--main, which controls the address of the ad. The first movement of the label translates the page into the active state.

Active state. In the active state, the page allows you to make changes to the form and send it to the server, view similar ads on the map, filter them and specify detailed information about them, showing a card for each of the ads.

1. Filling in information
1.1. Filling in information and sending data:

header;
address;
property type;
rooms;
number of beds;
the time of arrival and departure from the apartment.
advanced setting:
parking;
Wi-Fi;
conditioner;
kitchen;
washing machine;
Elevator;
photos
free text description

1.2. Filling in all information is done on one page without intermediate transitions. The order of filling in the information is not important.

1.3. After filling in all the data, when you click on the "publish" button, all the data from the form, including images, are sent to the server via AJAX request https://js ahhh!dump.academy/keksobooking by POST method with multipart / form-data type.

1.4. The page responds to incorrectly entered values in the form. If the data entered into the form does not meet the limitations specified in the section describing the input fields, the form cannot be sent to the server. When you try to submit a form with incorrect data, the submission does not occur, and incorrectly filled fields are highlighted with a red frame. The method of adding a frame and its style are arbitrary.

1.5. Upon successful submission of the form, the page, without reloading, goes to the initial inactive state: all filled fields are erased, labels of similar ads and the card of the active ad are removed, the address label is returned to its original position, the value of the address field is adjusted according to the position of the label. A message about successful submission of the form is displayed

The screen displays a message about the successful sending of data. The markup of the message, which is located in the #success block inside the template, should be placed in main. The message should disappear by pressing the Esc key and clicking on an arbitrary area of the screen.

1.6. If a query error occurs while sending data, a message is displayed. The layout of the message, which is located in block #error in the template, you need to place in main. The message should disappear after pressing the button .error__button, by pressing the Esc key and clicking on an arbitrary area of the screen.

1.7. Press the button .ad-form__reset resets the page to its original inactive state without reloading: all filled-in fields are erased, similar ad labels and the active ad card are removed, the address label is returned to its original position, the value of the address field is adjusted according to the position of the label.

2. Restrictions imposed on input fields
2.1. Ad title:

Required text field;
The minimum length is 30 characters;
Maximum length is 100 characters;

2.2. Price per night:

Required field;
Numeric field;
The maximum value is 1 000 000;

2.3. The housing Type field affects the minimum value of the price per night field»:

"Bungalow" - minimum price per night 0;
"Apartment" - minimum price per night 1 000;
"House" - minimum price 5 000;
"Palace" — the minimum price of 10 000;

Along with the minimum value of the price you need to change and the placeholder.

2.4. Address:

Manual editing of the field is prohibited. The value is automatically set when the label is moved .map__main pin on the map. The details of filling in the address field are described along with the label behavior.

2.5. The fields" check-in Time "and" check-out Time " are synchronized: when you change the value of one field, the second is allocated to it. For example, if the check-in time is "after 14", the check-out time will be "before 14" and Vice versa.

2.6. The field "Number of rooms" synchronized with the field "Number of seats" so that selecting numbers of rooms introduced restrictions on the available choices of number of guests:

1 room- " for 1 guest»;
2 rooms- "for 2 guests" or " for 1 guest»;
3 rooms - "for 3 guests", "for 2 guests" or " for 1 guest»;
100 rooms - " not for guests»;
There are different ways to limit the allowed values of the number of places field: removing the corresponding option elements from the markup, adding the disabled state to the option elements, or other ways to limit them, for example, using the setCustomValidity method.

3. Map address selection:
3.1. The approximate address of the apartment is indicated by dragging a special label on the map of Tokyo. When you move, the value of the corresponding input field changes. The contents of the address field can not be empty: immediately after loading the page and after resetting the form, the value must match the coordinates of the label.

3.2. The format of the address field value is {{x}}, {{y}}, where {{x}} and {{y}} are the coordinates to which the label points with its sharp end (the middle of the lower edge of the labeled block).

3.3. Note that the x and Y coordinates corresponding to the address must be calculated not from the top left corner of the labeled block, but from the point where the label points with its sharp end.

3.4. To prevent the label from being placed above the horizon or below the filter bar, the y coordinate must be limited to an interval of 130 to 630. The value of the x coordinate must be limited by the size of the block in which the label is dragged.

When the limit of movement of the marker horizontally as possible to take into account the width of the marker and not taken into account. If dragging does not take into account the width of the marker, the sharp end may point to the outermost point of the unit, with the portion of the marker will be outside of the unit. If you take into account the size of the marker, when you reach the edge of the block, the border of the marker will touch the edge, while the sharp end will be slightly spaced from the edge.


3.5. When you reset the form, the page returns to its original inactive state and the label moves to its original coordinates. The corresponding value of the address input field must also be updated.

4. Comparison with similar ads
4.1. The full list of similar ads is loaded after the page is active from the server https://js ahhh!dump.academy/keksobooking / data. Each of the ads is shown on the map as a special label: a block having the map__pin class. Template element for the label .map__pin is in template. The layout of each label should be similar to the template element.

4.2. When you click on the label of a similar ad, a card containing detailed information about the ad is displayed. The layout of the card should be based on a template element .map__card located in the template element. The data in the card is inserted in the same way as the data inserted in the template card as an example. If there is not enough data to fill in, the corresponding block in the card is hidden. For example, if the ad does not specify any convenience, you need to hide the block .popup__features. Immediately after switching to active mode, the card is not displayed, it is shown only after clicking on one of the labels. This adds a class to the active label .map__pin--active. Click the label .map__pin--main does not display the card.

4.3. At any given time, only one card can be opened, that is, clicking on the label of another similar ad should close the current card if it is open and show the card corresponding to another ad.

4.4. You can close an open card with detailed information either by clicking on the cross icon in the upper right corner of the ad or by pressing the Esc key on the keyboard.

4.5. Objects nearby can be filtered. Filtering is performed by the same parameters that are specified for the ad:

type of housing;
price per night;
number of rooms;
number of guests;
added convenience;
Filtering is performed when the values of the corresponding fields of the form are changed .map__filters.

4.6. Before you change filters, or when you change a filter, the map should show all the appropriate options, but no more than five labels, regardless of the filter you select.

4.7. The form that filters similar ads at the time of opening the page is blocked and becomes available only after the download of all similar ads.

4.8. Rendering of the corresponding elements exposed to the filters should take place no more than once in half a second (elimination of chatter).

4.9. When you change filters, the card showing details of a similar ad should be hidden.

5. Availability and active elements:
5.1. Interaction with all active elements on the page should be available not only with the cursor and clicks on them, but also with the keyboard: all active elements should focus and respond to the Enter key as well as to the click.
