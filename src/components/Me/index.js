import React from 'react';
import { useQuery, gql } from '@apollo/client';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
//import StarBorderIcon from '@material-ui/icons/StarBorder';
import GitHubIcon from '@material-ui/icons/GitHub';
import LinkedInIcon from '@material-ui/icons/LinkedIn';

const useStyles = makeStyles((theme) => ({
    icons: {
        color: theme.palette.primary.dark,  
    }
}));
  

const PROFILE_IMAGE = gql`
query {
  repositoryOwner(login: "redmarmaduke") {
    profileImageUrl: avatarUrl
  }
}
`;


const PROFILE_DATA = {
    gitHubUrl: "https://github.com/redmarmaduke",
    linkedInUrl: "https://www.linkedin.com/in/manuel-nunes-272ba31b/",
    whoAmI: "Looking for roles in web development, SDET for systems / firmware, or computer graphics.  I'm a computer graphics hobbyist and a graduate of the UC Berkeley Coding Boot Camp."
}

export default function Me(props) {
    const classes = useStyles();

    const { loading, error, data } = useQuery(PROFILE_IMAGE);
    if (loading) {
        return <p>Loading</p>;
    }
    if (error) {
        console.log(error);
        return <p>Error</p>;
    }
    if (!data) {
        return <p>Not found!</p>;
    }

    let { repositoryOwner: { profileImageUrl: image } } = data;
//["sticky-container", props.className].join(" ")
    return (
        <div>
            <div style={{ float: "left", position: "relative", display: "block", overflow: "hidden", height: "100%"}}>
                <img src={image} style={{ margin: "0 1rem"}} alt="biography"></img>
                <div style={{ display: "flex", justifyContent: "flex-end", position: "absolute", bottom: 0, right: "1rem", color: "#FFF" }}>
                    <IconButton aria-label={`GitHub`} >
                        <a href={PROFILE_DATA.gitHubUrl}><GitHubIcon className={classes.icons}/></a>
                    </IconButton>
                    <IconButton aria-label={`GitHub`} >
                        <a href={PROFILE_DATA.linkedInUrl}><LinkedInIcon className={classes.icons}/></a>
                    </IconButton>
                </div>
            </div>
            <p style={{ float: "clear", textAlign: "left", fontSize: "40px", color: "#000" }}>{PROFILE_DATA.whoAmI}</p>
        </div>
    )
}