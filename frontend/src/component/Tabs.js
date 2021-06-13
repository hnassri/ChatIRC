import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ChatMessage from "../component/ChatMessage"
import SocketContext from "../context/socket"

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 224,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export default function VerticalTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState("");
  const [channels, setChannels] = React.useState([]);
  const socket = React.useContext(SocketContext);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem("auth"));
    const getChannels = () => {
      const data = {
        username: user.username
      };
      socket.emit("get channels", data);
    }
    socket.on("channels joined", function(data) {
        if(data.success === "success"){
            console.log("Mise à jour de vos channels réussis");
            setChannels(data.channels);
        }else{
            alert('Erreur dans la mise à jour de vos channels');
        }
    });
    socket.on("nickname update", function(data) {
        if(data.success === "success"){
            alert("Your nickname has been updated");
            user.username = data.username;
            localStorage.setItem("auth", JSON.stringify(user));
        }else{
            alert('Update failed');
        }
    });
    socket.on("joinChannel", function(data) {
        if(data.success === "success"){
            alert("You are join channel " + data.channel_name);
            getChannels();
        }else{
            alert('Update failed');
        }
    });
    socket.on("leaveChannel", function(data) {
        if(data.success === "success"){
            alert("You are leave channel " + data.channel_name);
            getChannels();
        }else{
            alert("Channel don't exist");
        }
       });
    socket.on("deleteChannel", function(data) {
        if(data.success === "success"){
            alert("You are delete channel " + data);
        }else{
            alert("Channel don't exist");
        }
    });
    socket.on("listChannel", function(data) {
      if(data.success === "success"){
          alert("channel " + data.channels);
      }else{
          alert("we have. no channel with this name");
      }
  });
  socket.on("privatemsg", function(data) {
    if(data.success === "success"){
        alert("msg send");
    }else{
        alert("msg not send");
    }
});
    socket.on("add channel", function(msg) {
        alert("You have create " + msg + " channel");
        socket.emit('join', {
          channel_name: msg,
          user: user
      });
    });
    getChannels();
}, []);


  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
      >
        {channels.map((channel, index) => {
          return(
            <Tab label={channel} {...a11yProps(index)} key={"tab-" + index}/>
          )
        })}
      </Tabs>
      {channels.map((channel, index) => {
          return(
            <TabPanel value={channel.name} index={index} key={"tab-panel-" + index}>
              <ChatMessage />
            </TabPanel>
          )
      })}
    </div>
  );
}
