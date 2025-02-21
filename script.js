let reminders = JSON.parse(localStorage.getItem("reminders")) || [];
        function setReminder() 
        {
            let medicine = document.getElementById('medicine').value;
            let time = document.getElementById('reminderTime').value;
            if (!medicine || !time) 
            {
                alert("Please enter medicine name and time.");
                return;
            }
            reminders.push({ medicine, time, notified: false, status: null });
            localStorage.setItem("reminders", JSON.stringify(reminders));
            displayReminders();
            alert("Reminder set for " + medicine + " at " + time);
        }
        function displayReminders() 
        {
            let reminderList = document.getElementById('reminderList');
            reminderList.innerHTML = "";
            reminders.forEach((reminder, index) => 
            {
                let reminderDiv = document.createElement("div");
                reminderDiv.classList.add("reminder-item");
                reminderDiv.innerHTML = `
                    ${reminder.medicine} at ${reminder.time}
                    <button class="delete-btn" onclick="deleteReminder(${index})">Delete</button>
                    ${reminder.status ? `<span class="tick ${reminder.status}-tick">✔</span>` : ''}
                `;
                reminderList.appendChild(reminderDiv);
            });
        }
        function deleteReminder(index) 
        {
            reminders.splice(index, 1);
            localStorage.setItem("reminders", JSON.stringify(reminders));
            displayReminders();
        }
        function checkReminder() 
        {
            setInterval(() => 
            {
                let currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                reminders = JSON.parse(localStorage.getItem("reminders")) || [];
                reminders.forEach((reminder, index) => 
                {
                    if (reminder.time === currentTime && !reminder.notified) 
                    {
                        showModal(reminder.medicine, index);
                    }
                });
            }, 1000);
        }
        function showModal(medicine, index) 
        {
            document.getElementById('medicineName').innerText = "Take your " + medicine;
            document.getElementById('modal').style.display = 'flex';
            document.getElementById('notificationSound').play();
            reminders[index].notified = true;
            localStorage.setItem("reminders", JSON.stringify(reminders));
            showNotification(medicine);
        }
        function showNotification(medicine) 
        {
            if (Notification.permission === "granted") 
            {
                new Notification("Medicine Reminder", 
                {
                    body: `Time to take your medicine: ${medicine}`,
                    icon: "https://cdn-icons-png.flaticon.com/512/535/535239.png"
                });
            } 
            else if (Notification.permission !== "denied") 
            {
                Notification.requestPermission().then(permission => 
                {
                    if (permission === "granted") 
                    {
                        showNotification(medicine);
                    }
                });
            }
        }
        function snoozeReminder() 
        {
            let medicine = document.getElementById('medicineName').innerText.replace("Take your ", "");
            let snoozeTime = new Date();
            snoozeTime.setMinutes(snoozeTime.getMinutes() + 5);
            let formattedTime = snoozeTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            reminders.push({ medicine, time: formattedTime, notified: false, status: null });
            localStorage.setItem("reminders", JSON.stringify(reminders));
            closeModal();
            displayReminders();
        }
        function markAsTaken() 
        {
            let medicine = document.getElementById('medicineName').innerText.replace("Take your ", "");
            let index = reminders.findIndex(reminder => reminder.medicine === medicine && reminder.notified);
            if (index !== -1) 
            {
                reminders[index].status = 'green';
                localStorage.setItem("reminders", JSON.stringify(reminders));
                displayReminders();
            }
            closeModal();
        }
        function closeModal() 
        {
            let medicine = document.getElementById('medicineName').innerText.replace("Take your ", "");
            let index = reminders.findIndex(reminder => reminder.medicine === medicine && reminder.notified);
            if (index !== -1 && reminders[index].status === null) 
            {
                reminders[index].status = 'red';
                localStorage.setItem("reminders", JSON.stringify(reminders));
                displayReminders();
            }
            document.getElementById('modal').style.display = 'none';
        }
displayReminders();
checkReminder();