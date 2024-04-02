document.addEventListener('DOMContentLoaded', function() {
    
    //Tabs
    var currentTab = 0;
    showTab(currentTab);

    let serviceArray = [
        { title: 'Virtual Number', items: [] },
        { title: 'Talk Time', items: [] },
        { title: 'Call Transferring', items: [] },
        { title: 'Ring Groups', items: [] },
        { title: 'Auto Attendant', items: [] },
        { title: 'Call Recording', items: [] },
        { title: 'None', items: [] }
    ];

    let hardwareArray = [
        {title: 'Yealink T31P', items: []},
        {title: 'Yealink T43U', items: []},
        {title: 'Yealink W56h', items: []},
        {title: 'Yeastar App', items: []},
        {title: 'Network Switch', items: []},
        {title: 'Ethernet Cable', items: []}
    ];
    
    function showTab(n) {
        var tab = document.getElementsByClassName("tab");
        tab[n].style.display = "block";
        tab
        checkValidity(false);
    };
    
    window.nextPrev = function nextPrev(n) {
        var tab = document.getElementsByClassName("tab");
        tab[currentTab].style.display = "none";
        currentTab += n;
        showTab(currentTab)
    };

    function checkValidity(isValid) {
        const nextBtn = document.getElementById('next-button');
        const totalFooter = document.getElementsByClassName('footer-total')[0];
    
        if (!nextBtn || !totalFooter) {
            console.error('Next Button or Footer total not found');
            return; // Exit the function if elements are not found
        }
    
        if (isValid) {
            nextBtn.disabled = false;
            nextBtn.style.opacity = '1';
            nextBtn.style.cursor = 'pointer';
            totalFooter.style.display = 'inline-flex';
            populateServiceTable(); // Populate the table only if valid
            populateHardwareTable();
            totalMonthlyCost(serviceArray);
        } else {
            nextBtn.disabled = true;
            nextBtn.style.opacity = '0.6';
            nextBtn.style.cursor = 'default';
            totalFooter.style.display = 'none';
        }
    }
    
    //Price Formatter

    function formatPrice(price) {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
            maximumSignificantDigits: 5
        }).format(price);
    }

    function updateServiceArray(categoryTitle, itemDetails, removeTitle) {
        let category = serviceArray.find(category => category.title === categoryTitle);
        
        if (!category) {
            console.error('Category not found');
            return;
        }
    
        // Remove conflicting item if specified
        if (removeTitle) {
            category.items = category.items.filter(item => item.title !== removeTitle);
        }
        
        // Update or add the new item
        let existingItemIndex = category.items.findIndex(item => item.title === itemDetails.title);
        
        if (existingItemIndex !== -1) {
            category.items[existingItemIndex] = itemDetails;
        } else {
            category.items.push(itemDetails);
        }
    }
    

    function populateServiceTable(){
        const tbody = document.querySelector('.review-services table tbody');
        tbody.innerHTML = '';

        serviceArray.forEach(category => {
            category.items.forEach(item => {
                const row = document.createElement('tr');

                row.innerHTML = 
                `
                <td>
                    <img src="${item.image}" alt="">
                </td>
                <td>
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                </td>
                <td>
                    <p>${item.quantity}</p>
                </td>
                <td>
                    <p>${item.price}</p>
                </td>
            `;

                tbody.appendChild(row);
            });
        });
    }

    function updateHardwareArray(hardwareTitle, itemDetails) {
        // This function should be designed to add or update the hardware item in a global array
        let found = false;
    
        for (let category of hardwareArray) {
            if (category.title === hardwareTitle) {
                found = true;
                const existingIndex = category.items.findIndex(item => item.title === itemDetails.title);
                if (existingIndex !== -1) {
                    if (itemDetails.quantity === 0) {
                        // Remove the item if quantity is zero
                        category.items.splice(existingIndex, 1);
                    } else {
                        // Update existing item
                        category.items[existingIndex] = itemDetails;
                    }
                } else if (itemDetails.quantity > 0) {
                    // Add new item
                    category.items.push(itemDetails);
                }
                break;
            }
        }
    
        if (!found) {
            console.error('Hardware title not found in array');
        }
    
        // Assuming you have a function to repopulate the hardware table based on `hardwareArray`
        populateHardwareTable();
    }
      

    function populateHardwareTable(){
        const tbody = document.querySelector('.review-hardware table tbody');
        tbody.innerHTML = '';

        hardwareArray.forEach(category => {
            category.items.forEach(item => {
                const row = document.createElement('tr');

                row.innerHTML = 
                `
                <td>
                    <img src="${item.image}" alt="">
                </td>
                <td>
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                </td>
                <td>
                    <p>${item.quantity}</p>
                </td>
                <td>
                    <p>${item.price}</p>
                </td>
            `;

                tbody.appendChild(row);
            });
        });
    }


    //Virtual Number

    const newNumberInput = document.getElementById('new-number-input');
    const portNumberInput = document.getElementById("port-number-input");
    const newNumberBtn = document.getElementById('new-number');
    const portNumberBtn = document.getElementById('port-number');


    window.virtualNumberBtn = function virtualNumberBtn(n) {

        if (n === 0) {
            newNumberInput.style.display = 'block'
            newNumberInput.classList.add('slide-in-top')
            portNumberInput.style.display = 'none'
            newNumberBtn.classList.add('selected')
            portNumberBtn.classList.remove('selected')
            portNumberInput.value = ''
            checkValidity(false)
        } else if(n === 1) {
            portNumberInput.style.display = 'block'
            portNumberInput.classList.add('slide-in-top')
            newNumberInput.style.display = 'none'
            newNumberBtn.classList.remove('selected')
            portNumberBtn.classList.add('selected')
            newNumberInput.value = '0'
            checkValidity(false)
        }
    };

    // New Number Validation
    newNumberInput.addEventListener('change', function () {
        const newNumberValue = newNumberInput.value;

        if (newNumberValue !== '0') {
            newNumberInput.style.border = "2px solid #4BD37B";
            updateServiceArray('Virtual Number', {
                image: 'Assets/Group 1685.png',
                title: 'New Number',
                description: '',
                quantity: 1,
                price: formatPrice(90)
            }, 'Transfer Number'); 
            checkValidity(true);
        } else {
            newNumberInput.style.border = "2px solid whitesmoke";
            checkValidity(false);
        }
    });

    // Transfer Number Validation
    portNumberInput.addEventListener('input', function () {
        const portNumberValue = portNumberInput.value;

        if (portNumberValue.length > 0 && portNumberInput.checkValidity()) {
            portNumberInput.style.border = "2px solid #4BD37B";
            updateServiceArray('Virtual Number', {
                image: 'Assets/Group 1685.png',
                title: 'Transfer Number',
                description: '[ ' + portNumberValue + ' ]',
                quantity: 1,
                price: formatPrice(90)
            }, 'New Number'); // Specify to remove 'New Number'
            checkValidity(true);
        } else {
            portNumberInput.style.border = "2px solid #FF5A79";
            checkValidity(false);
        }
    });


    //Talk time

    // Initialize progress on page load for the range slider
    const initialTalkTimeValue = document.getElementById('talk-time').value;
    const max = parseInt(document.getElementById('talk-time').max, 10);
    const min = parseInt(document.getElementById('talk-time').min, 10);
    const percentage = ((initialTalkTimeValue - min) / (max - min)) * 100;
    document.getElementById('talk-time').style.background = `linear-gradient(90deg, #0071E3 ${percentage}%, #D9D9D9 ${percentage}%)`;

    document.getElementById('talk-time').addEventListener('input', function () {
        const talkTimeValue = this.value; // Using 'this' as it refers to the element that triggered the event
        const perMinutePrice = 0.28;
        const talkTimeDescription = document.getElementById('talk-time-description');
    
        // Update displayed values for talk time
        document.getElementById('talk-time-value').textContent = new Intl.NumberFormat('fr-FR').format(talkTimeValue);
        document.getElementById('total-footer-price').textContent = formatPrice(talkTimeValue * perMinutePrice);
        updateServiceArray('Talk Time', {
            image: 'Assets/Group 1684.png',
            title: 'Talk Time',
            description: '',
            quantity: talkTimeValue + ' Minutes',
            price: formatPrice(talkTimeValue * perMinutePrice)
        }); // Ensure this function call is properly closed with a semicolon
    
        // Conditional descriptions based on talkTimeValue
        if (talkTimeValue >= 500 && talkTimeValue <= 1500) {
            talkTimeDescription.textContent = 'For small businesses (1-2 employees)';
        } else if (talkTimeValue > 1500 && talkTimeValue <= 5000) {
            talkTimeDescription.textContent = 'For medium businesses (3-10 employees)';
        } else if (talkTimeValue > 5000) {
            talkTimeDescription.textContent = 'For large businesses (10+ employees)';
        } else if (talkTimeValue < 500) {
            talkTimeDescription.textContent = 'For businesses who only recieve calls';
        }
    
        checkValidity(true);
    
        // Update range slider progress
        const max = parseInt(this.max, 10);
        const min = parseInt(this.min, 10);
        const value = parseInt(talkTimeValue, 10);
        const percentage = ((value - min) / (max - min)) * 100;
        // Update the background gradient to reflect the current value
        this.style.background = `linear-gradient(90deg, #0071E3 ${percentage}%, #D9D9D9 ${percentage}%)`;
    });
    

    //Hardware
    window.updateHardware = function updateHardware(event, isAdding) {
        const hardwareCard = event.target.closest('.hardware-card');
        if (!hardwareCard) return;
    
        const hardwareQty = hardwareCard.querySelector('.hardware-qty');
        const hardwareMinus = hardwareCard.querySelector('.hardware-minus');
        const hardwarePriceElement = hardwareCard.querySelector('h4');
        let qty = parseInt(hardwareQty.dataset.qty) || 0;
        let basePrice = parseInt(hardwarePriceElement.dataset.basePrice) || parseInt(hardwarePriceElement.textContent);
    
        qty = isAdding ? Math.min(qty + 1, 9) : Math.max(qty - 1, 0);
        let deviceSum = basePrice * qty; // Calculate total price based on current quantity.
    
        hardwareCard.classList.toggle('selected', qty > 0);
        hardwareQty.style.display = qty > 0 ? 'block' : 'none';
        hardwareMinus.style.display = qty > 0 ? 'inline-flex' : 'none';
        hardwareQty.innerHTML = qty.toString();
        hardwareQty.dataset.qty = qty.toString();
    
        const hardwareTitle = hardwareCard.querySelector('.hardware-title h2').textContent;
        const hardwareImage = hardwareCard.querySelector('.hardware-img').src;
        const hardwareDescription = hardwareCard.querySelector('.hardware-title h3').textContent;
        
        // Update hardware array to reflect the current state of selections
        updateHardwareArray(hardwareTitle, {
            image: hardwareImage,
            title: hardwareTitle,
            description: hardwareDescription,
            quantity: qty,
            price: formatPrice(deviceSum)
        });

        hardwareTotals();
        const totalQty = hardwareQtyTotal();

        updateSwitchAndCable(totalQty);
    };

    function updateSwitchAndCable(totalQty) {
        const switchPorts = Math.ceil(totalQty / 2) * 2;
        const cableLength = totalQty * 20;

        updateHardwareArray('Network Switch', {
            image: 'Assets/s-zoom.jpg',
            title: 'Network Switch',
            description: switchPorts + ' Port POE',
            quantity: 1,
            price: 'Included'
        });

        updateHardwareArray('Ethernet Cable', {
            image: 'Assets/Group 1780.png',
            title: 'Ethernet Cable',
            description: 'In meters',
            quantity: cableLength,
            price: 'Included'
        });
    }

    
    function hardwareQtyTotal() {
        const hardwareItems = document.querySelectorAll('.hardware-card');
        let totalQty = 0;
          
        hardwareItems.forEach(item => {
            const qty = parseInt(item.querySelector('.hardware-qty').dataset.qty) || 0;

            totalQty += qty;
        });

        return totalQty;
    };

    function hardwarePriceTotal() {
        const hardwareItems = document.querySelectorAll('.hardware-card');
        let totalPrice = 0;

        hardwareItems.forEach(item => {
            const qty = parseInt(item.querySelector('.hardware-qty').dataset.qty) || 0;
            const basePrice = parseInt(item.querySelector('h4').dataset.basePrice) || parseInt(item.querySelector('h4').textContent);
            const devicePrice = basePrice * qty;
            
            totalPrice += devicePrice;
        });

        return totalPrice;
    };

    function hardwareTotals() {
        const totalPrice = hardwarePriceTotal()
        const totalQty = hardwareQtyTotal();
        const isValid = totalQty > 0;

        document.getElementById('total-footer-price').textContent = formatPrice(totalPrice);
        document.getElementById('total-cost-period').style.display = 'none';

        document.getElementById('total-once-off-cost').textContent = formatPrice(totalPrice);

        checkValidity(isValid);
    };

    //Horizontal Scroll
    document.getElementById('scroll-button').addEventListener('click', function() {
        const hardwareContainer = document.getElementsByClassName('hardware-container-outer')[0];
        const scrollAmount = 300;
        hardwareContainer.scrollLeft += scrollAmount;
    });

    //System Features

    function extentionPriceTotal(){
        const qty = hardwareQtyTotal();
        let totalPrice = qty * 25;

        return totalPrice;
    }

    window.featuresAdd = function featuresAdd(event) {
        const featureCard = event.target.closest('.features-card');
        if (!featureCard) return;
    
        const allFeatureCards = document.querySelectorAll('.features-card');
        const finalFeatureCard = document.getElementById('no-features');
        const featuresAdd = featureCard.querySelector('.features-add');
    
        // If the final feature card is clicked
        if (featureCard.id === 'no-features') {
            allFeatureCards.forEach(card => {
                // Deselect all other feature cards
                if (card.id !== 'no-features') {
                    card.classList.remove('selected');
                    const featuresAddBtn = card.querySelector('.features-add');
                    if (featuresAddBtn) {
                        featuresAddBtn.classList.remove('clicked');
                    }
                }
            });
    
            // Toggle the final feature card
            featureCard.classList.toggle('selected');
            document.getElementById('total-footer-price').textContent = formatPrice(0);
            document.getElementById('total-cost-period').style.display = 'inline-flex';
            checkValidity(featureCard.classList.contains('selected'));
        } else {
            // For any non-final feature card
            featureCard.classList.toggle('selected');
            if (featuresAdd) {
                featuresAdd.classList.toggle('clicked');
            }
    
            // If any non-final feature card is selected, deselect the final feature card
            if (finalFeatureCard.classList.contains('selected')) {
                finalFeatureCard.classList.remove('selected');
                // Reset any state/effects associated with the final feature card
                // For example, setting total price back to the sum of selected non-final features
                document.getElementById('total-footer-price').textContent = formatPrice(extentionPriceTotal()); // Assuming hardwarePriceTotal() recalculates the correct total
                document.getElementById('total-cost-period').style.display = 'none'; // Adjust based on desired behavior
            }
    
            // Update feature state and check validity for non-final feature cards
            updateFeatureState(); // This should now consider the deselection of the final feature card
        }

        const featureTitle = featureCard.querySelector('.features-card-text h3').textContent;
        const featureImage = featureCard.querySelector('.features-card img').src;
        const featureDescription = featureCard.querySelector('.features-card-text p').textContent;
        
        updateServiceArray(featureTitle, {
            image: featureImage,
            title: featureTitle,
            description: '',
            quantity: 1,
            price: 'included'
        });

    };
    
    function updateFeatureState() {
        const featureCards = document.querySelectorAll('.features-card:not(#no-features)');
        let isSelected = Array.from(featureCards).some(card => card.classList.contains('selected'));
        
        if (isSelected) {
            document.getElementById('total-footer-price').textContent = formatPrice(extentionPriceTotal());
            document.getElementById('total-cost-period').style.display = 'inline-flex';
            checkValidity(true);
        } else {
            document.getElementById('total-footer-price').textContent = formatPrice(0);
            document.getElementById('total-cost-period').style.display = 'none';
            checkValidity(false);
        }
    }

    function  totalMonthlyCost(serviceArray) {
        let totalPrice = 0;

        serviceArray.forEach(service => {
            service.items.forEach(item => {
                totalPrice += Number(item.price);
            });
        });
        document.getElementById('total-monthly-cost').textContent = formatPrice(totalPrice);
    }

});