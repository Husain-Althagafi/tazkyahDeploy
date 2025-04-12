import '../styles/Courses.css';
import React, { useState } from "react";


export function NewCourses() {
    // Array of new courses images
    const newCoursesImgs = [
        { id: 1, img: "https://placehold.co/200x200?text=Course+1" },
        { id: 2, img: "https://placehold.co/200x200?text=Course+2" },
        { id: 3, img: "https://placehold.co/200x200?text=Course+3" },
        { id: 4, img: "https://placehold.co/200x200?text=Course+4" },
        { id: 5, img: "https://placehold.co/200x200?text=Course+5" }
    ];

    // State to track the starting index of visible courses
    const [startIndex, setStartIndex] = useState(0);
    const totalCourses = newCoursesImgs.length;

    // Function to cycle to the next set of courses
    const nextCourses = () => {
        setStartIndex((prevIndex) => (prevIndex + 1) % totalCourses);
    };

    // Function to cycle to the previous set of courses
    const prevCourses = () => {
        setStartIndex((prevIndex) => (prevIndex - 1 + totalCourses) % totalCourses);
    };

    // Selecting the three images
    const displayedCourses = [
        newCoursesImgs[startIndex % totalCourses],
        newCoursesImgs[(startIndex + 1) % totalCourses],
        newCoursesImgs[(startIndex + 2) % totalCourses]
    ];

    return (
        <div className="new-courses-container">
            <button onClick={prevCourses}>◀</button>
            <div className="new-courses-imgs-container">
                {displayedCourses.map((course) => (
                    <img key={course.id} src={course.img} alt={`Course ${course.id}`} />
                ))}
            </div>
            <button onClick={nextCourses}>▶</button>
        </div>
    );
}

// Filter Bar and Courses Cards Section
export function FilterBar() {

    const Allcourses = [ // We could manipulate this array using JS code to add and remove!
        {id: 1, imgPath: "https://placehold.co/200x200?text=Available 1", title: "Course 1", description: "Course Description", courseStatus: "Available"},
        {id: 2, imgPath: "https://placehold.co/200x200?text=Unavailable 1", title: "Course 2", description: "Course Description", courseStatus: "Unavailable"},
        {id: 3, imgPath: "https://placehold.co/200x200?text=Available 2", title: "Course 3", description: "Course Description", courseStatus: "Available",},
        {id: 4, imgPath: "https://placehold.co/200x200?text=Unavailable 2", title: "Course 4", description: "Course Description", courseStatus: "Unavailable"},
        {id: 5, imgPath: "https://placehold.co/200x200?text=Unavailable 3", title: "Course 5", description: "Course Description", courseStatus: "Unavailable"}
    ]

    const [filteredCourses, setFilteredCourses] = useState(Allcourses);

    const filterCourses = (status) => {
        if (status === "All") {
            setFilteredCourses(Allcourses);
        } else {
            setFilteredCourses(Allcourses.filter(course => course.courseStatus === status));
        }
    };

    const handleSearch = (event) => {
        if (event.key === "Enter") {
            const serachResult = event.target.value;
            setFilteredCourses(Allcourses.filter(course => course.title.toLowerCase().includes(serachResult)))}
    } 

    return(
        <>
            <div className='btn-container'>
                {/* FilterBar Section */}
                <button onClick={() => filterCourses("All")} className="btn">All</button>
                <button onClick={() => filterCourses("Available")} className="btn">Avalabile</button>
                <button onClick={() => filterCourses("Unavailable")} className="btn">Unavailable</button>
                <input onKeyDown={handleSearch} type="text" id="searchBar" name="searchBar"></input>
            </div>
                {/* Array Courses Section */}
            <div className='cards-container'>
                {filteredCourses.map((course) => ( 
                    <CourseCard
                        key={course.id} 
                        imgPath={course.imgPath} 
                        title={course.title} 
                        description={course.description} 
                    />
            ))}
            </div>
        </>
    );
}

// Single Course Card Section
function CourseCard(course) {

    return(
        <div className="course-card-container">
            <img src={course.imgPath} />
            <h3 className="course-card">{course.title}</h3>
            <p className="course-card">{course.description}</p>
        </div>
    );
}


// export function MainFooter() {
//     return(

//     );
// }

