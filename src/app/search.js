import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Axios from "../axios";
import Friendshipbtn from "./friendshipbtn";

export default function Search() {
    //the first value is the property value in state and the 2nd prperty is the function that whenever you call it, it changes the value of the first property of set state.
    const [searchWord, setSearchWord] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        console.log("User Is Typing In Input Field");
        if (searchWord !== "") {
            Axios.get(`/findpeople?q=${searchWord}`).then((response) => {
                console.log("SEARCH QUERY RESPONSE: ", response);
                setUsers(response.data);
            });
        }
    }, [searchWord]);

    useEffect(() => {
        let abort;
        (() => {
            Axios.get("/lastJoinedUsers").then((response) => {
                if (!abort) {
                    setUsers(response.data.userData);
                }
            });
        })();
        return () => {
            abort = true;
        };
    }, []);

    return (
        <div className="searchContainer has-text-grey-lighter">
            {/* ************* DROP DOWN LIST SECTION ************* */}
            <div className="section column is-one-quarter is-paddingless dropDown">
                <div className="select">
                    <select>
                        <option>Select dropdown</option>
                        <option>Job Title</option>
                        <option>City</option>
                        <option>Country</option>
                    </select>
                </div>
            </div>
            {/* ************* SEARCH SECTION ************* */}
            <div className="section column is-half">
                <div className="field">
                    <div className="control">
                        <input
                            className="input is-small"
                            type="text"
                            placeholder="Search By User..."
                            onChange={(e) => setSearchWord(e.target.value)}
                        />
                        {/* ************* RESULTS SECTION ************* */}

                        <ul>
                            {users &&
                                users.map((user, index) => (
                                    <article className="media" key={index}>
                                        <figure className="media-left">
                                            <p className="image is-64x64">
                                                <img src={user.profilepic} />
                                            </p>
                                        </figure>
                                        <div className="media-content searchContent">
                                            <div className="content ">
                                                <p className="searchResultsData">
                                                    <Link
                                                        className="has-text-white-ter"
                                                        to={"/user/" + user.id}
                                                    >
                                                        <strong>
                                                            {user.firstname}{" "}
                                                            {user.lastname}
                                                        </strong>
                                                    </Link>
                                                    <br />
                                                    <small>Job Title</small>
                                                    <br />
                                                    <small>City, Country</small>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="media-right">
                                            <Friendshipbtn
                                                otherUserId={user.id}
                                            />
                                        </div>
                                    </article>
                                ))}
                            {users && !users.length && (
                                <h3> No results found</h3>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

//  <ul>
//
