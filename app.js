/***********************************************************
 * Marlian App 2.0
 * As inspired by @oyindamola of startNG
 * Author- @buka4rill
 * All Rights Reserved
 * This App is written with JS Module Design pattern & OOP
 **********************************************************/

// Local Storage Controller
const LSCtrl = (() => {
    // Add items to Local storage

    // Public methods 
    return {
        // Store courses in LS
        storeCourse: (course) => {
            let courses;

            // Check if there are any courses in LS
            if (localStorage.getItem('courses') === null) {
                courses = [];

                // Push new course
                courses.push(course);

                // Set LS
                localStorage.setItem('courses', JSON.stringify(courses));
            } else {
                courses = JSON.parse(localStorage.getItem('courses'));

                // Push new courses to already existing courses
                courses.push(course);

                // Reset LS
                localStorage.setItem('courses', JSON.stringify(courses));
            }
        }, 
        getCoursesFromStorage: function() {
            let courses;

            // Check if there are any courses in LS
            if (localStorage.getItem('courses') === null) {
                courses = [];
            } else {
                courses = JSON.parse(localStorage.getItem('courses'));
            }

            return courses;
        },
        deleteCourseFromStorage: (id) => {
            let courses = JSON.parse(localStorage.getItem('courses'));

            // Loop thru courses
            courses.forEach((course, index) => {
                if (id === course.id) {
                    courses.splice(index, 1);
                }
            });

            // Reset LS
            localStorage.setItem('courses', JSON.stringify(courses));
        },
        clearCoursesFromStorage: () => {
            localStorage.removeItem('courses');
        }
    }
})();


// Course Controller
const CourseCtrl = (function() {
    // Constructor
    const Course =  function(id, name) {
        this.id = id;
        this.name = name;
    }

    // State or Data (Usually from a database)
    const data = {
        courses: LSCtrl.getCoursesFromStorage(),
        currentCourseItem: null
    }

    // Public methods
    return {
        getCourses: () => {
            return data.courses;   
        },
        addCourse: name => {
            let ID;
            // Create id
            if (data.courses.length > 0) {
                ID = data.courses[data.courses.length - 1].id + 1;
            } else {
                ID = 1
            }

            // Create new Course
            newCourse = new Course(ID, name);

            // Add new course to course array
            data.courses.push(newCourse);

            return newCourse;
        },
        getCourseById: (id) => {
            let found = null;

            // loop thru the courses
            data.courses.forEach((course) => {
                if(course.id === id) {
                    found = course;
                }
            }); 
        
            return found;
        },
        setCurrentCourseItem: (courseItem) => {
            data.currentCourseItem = courseItem;
        },  
        getCurrentCourse: () => {
            console.log(2, data.currentCourseItem)
            return data.currentCourseItem;
        },
        deleteCourse: id => {
            // Get id
            // loop thru ids in database
            ids = data.courses.map(course => {
                return course.id;
            });

            // Get index
            index = ids.indexOf(id);
            
            // Remove item
            data.courses.splice(index, 1);
        },
        clearAllData: () => {
            data.courses = [];
        },
        logData: () => {
            return data;
        }
    }
})();

// UI Controller
const UICtrl = (() => {
    // Class and ID selectors
    const UISelectors = {
        container: '.container',
        actionDiv: '.course-action',
        formDiv: 'form-div',
        courseBtn: '.option',
        courseNameInput: '#course-name',
        addBtn: '.add-course',
        coursesCollection: '#courses-collection',
        filterInput: '#filter-courses',
        coursesList: '#courses-collection li',
        clearAllBtn: '.clear-course'
    }

    // Public methods
    return {
        getSelectors: () => {
            return UISelectors;
        },
        populateCourseList: courses => {
            let html = '';

            courses.forEach(course => {
                html += `
                    <li class="courses" id="course-${course.id}"> ${course.name} <a href="#" class="remove u-pull-right"> x </a></li>                
                `;
            });

            // Insert into UL
            document.querySelector(UISelectors.coursesCollection).innerHTML = html;
        },
        getInputedCourse: () => {
            return {
                name: document.querySelector(UISelectors.courseNameInput).value
            }
        },
        addCourseItem: course => {
            // Create li element
            const li = document.createElement('li');
            // Add class
            li.className = 'courses';
            // Add ID
            li.id = `course-${course.id}`;
            // Add HTML
            li.innerHTML = `${course.name} <a href="#" class="remove u-pull-right"> x </a>`;
            // Insert Course to UL
            document.querySelector(UISelectors.coursesCollection).insertAdjacentElement('beforeend', li);
        },
        clearInput: () => {
            document.querySelector(UISelectors.courseNameInput).value = "";
        },
        deleteCourseItem: id => {
            const courseID = `#course-${id}`;
            const course = document.querySelector(courseID);
            course.remove();
        },
        clearAllCoursesInUI: () => {
            const courseList = document.querySelectorAll(UISelectors.coursesList);

            for (course of courseList) {
                // remove node
                course.remove();
            }
        },
        showErrorAlert: (message, className) => {
            // Create div
            const div = document.createElement('div');
            // Add className
            div.className = `alert u-full-width ${className}`;
            // Add text
            div.append(document.createTextNode(message));

            // Get parent
            const actionDiv = document.querySelector(UISelectors.actionDiv);

            // Insert alert
            actionDiv.insertBefore(div, actionDiv.children[4]);

            // set 5 secs timeout
            setTimeout(() => {
                document.querySelector('.alert').remove();
            }, 5000);
        },
        courseBtnDisable: (e) => {
            e.target.disabled = true;
        }, 
        courseBtnEnable: () => {
            let courseButtons = document.querySelectorAll(UISelectors.courseBtn);

            for (courseButton of courseButtons) {
                courseButton.disabled = false;
            }
        }
    }
})();

// App Controller
const App = ((CourseCtrl, UICtrl) => {
    // 1. Get UI Selectors into App Controller
    const UISelector = UICtrl.getSelectors();

    // 2. Add Course to list by button or input
    const addDefaultCoursesToList = e => {
        e.preventDefault();

        const courseObject = { name: e.target.textContent };

        // Add Course to state
        const newCourse = CourseCtrl.addCourse(courseObject.name);

        // Add Course Item to UI List
        UICtrl.addCourseItem(newCourse);

        // Add to LS
        LSCtrl.storeCourse(newCourse);

        // Disable button
        UICtrl.courseBtnDisable(e);
    }
    
    // 3. Load Event Listener    
    const loadEventListeners = () => {
        // Add Item Event
        document.querySelector(UISelector.addBtn).addEventListener('click', addInputedCourseToList);

        // Delete Course Event
        document.querySelector(UISelector.coursesCollection).addEventListener('click', deleteCourse);

        // Delete All Course from UL Event
        document.querySelector(UISelector.clearAllBtn).addEventListener('click', clearAllCourses)

        // Filter Task Event
        document.querySelector(UISelector.filterInput).addEventListener('keyup', filterCourses);
    }

    // 4. Add available couses on click of the button
    let courseButtons = document.querySelectorAll(UISelector.courseBtn);
    // Convert nodelist into array
    courseButtons = Array.from(courseButtons);

    courseButtons.forEach(courseButton => {
        courseButton.addEventListener('click', addDefaultCoursesToList); 
    });


    // 5. Add Inputed Courses to UL
    const addInputedCourseToList = e => {
        e.preventDefault();

        // Get form Input object from UI Controller
        const formInput = UICtrl.getInputedCourse();

        if (formInput.name === "") {
            UICtrl.showErrorAlert('Please type in a Course', 'error');
        } else {
            // Add Course gotten from input to state
            const newCourse = CourseCtrl.addCourse(formInput.name);

            // Add Course to UI
            UICtrl.addCourseItem(newCourse);

            // Store in LS
            LSCtrl.storeCourse(newCourse);

            // Show success message
            UICtrl.showErrorAlert('Course added successfully!', 'success');

            // Clear input
            UICtrl.clearInput();
        }     
    }

    // 6. The Delete Button on Courses
    const deleteCourse = e => {
        e.preventDefault();

        // Event delegation
        if (e.target.classList.contains('remove')) {
            // We are deleting from state (database)
            // Get course item id (ie: course-1, course-2)
            const courseId = e.target.parentNode.id;

            // Split id by "-"
            const courseIdArr = courseId.split('-');

            // Get the actual id
            const id = Number(courseIdArr[1]);

            // Now that the ID has been gotten, we have to set it to 
            // it's corresponding object (courseToDelete)
            const courseToDelete = CourseCtrl.getCourseById(id);

            console.log(12,courseToDelete)

            // Set state to current state
            CourseCtrl.setCurrentCourseItem(courseToDelete);

            // Get current set course from state
            currentCourseInState = CourseCtrl.getCurrentCourse();
            console.log(13, currentCourseInState);

            // Delete current course from data structure
            CourseCtrl.deleteCourse(currentCourseInState.id);

            // Delete from UI
            UICtrl.deleteCourseItem(currentCourseInState.id);

            // Enable button if html content of deleted btn is a match
            const listText = e.target.parentNode.firstChild.textContent.toLowerCase().trim();

            courseButtons.forEach(courseButton => {
                btnText = courseButton.firstChild.textContent.toLowerCase().trim();

                // if btn text and list text is a match
                if(btnText.indexOf(listText) != -1 && courseButton.disabled == true) {
                    courseButton.disabled = false;
                }
            });

            // Delete from LS
            LSCtrl.deleteCourseFromStorage(currentCourseInState.id);
        }
    }

    // 7. Clear All Courses Event
    const clearAllCourses = () => {
        // Delete all courses from data structure
        CourseCtrl.clearAllData();

        // Clear Courses in UI
        UICtrl.clearAllCoursesInUI();

        // Clear for Local storage
        LSCtrl.clearCoursesFromStorage();

        // Enable course buttons after delete
        UICtrl.courseBtnEnable()
        // courseButtons.forEach(courseButton => {
        //     courseButton.disabled = false;
        // })
    }

    // 8. Filter Courses Event
    const filterCourses = (e) => {
        const text = e.target.value.toLowerCase();

        document.querySelectorAll(UISelector.coursesList).forEach(course => {
            const courseText = course.firstChild.textContent;

            // if course text content matches that of inputed text
            if(courseText.toLowerCase().indexOf(text) != -1) {
                // show course
                course.style.display = 'block';
            } else {
                course.style.display = 'none';
            }
        });
    }
     

    // Public methods
    return {
        init: () => {
            // Fetch Courses from state
            const courses = CourseCtrl.getCourses();

            // Populate Course List on app load
            UICtrl.populateCourseList(courses);

            courses.forEach(course => {
                const courseName = course.name;

                courseButtons.forEach(courseBtn => {
                    btnText = courseBtn.firstChild.textContent.toLowerCase().trim();
    
                    if (btnText.indexOf(courseName.toLowerCase()) != -1 && courseBtn.disabled == false) {
                        courseBtn.disabled = true;
                        
                        // courseBtn.addEventListener('mouseover', ()=>{
                        //     courseBtn.classList.remove('html');
                        //     // console.log(1)
                        // })
                    }
                });
            }); 

            // Call load event listener function
            loadEventListeners();
        }
    }
})(CourseCtrl, UICtrl);

App.init();