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
    height: "93vh",
    width: "50vh"
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  tab_panel: {
    overflow: "scroll",
  },
}));

export default function VerticalTabs(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [channels, setChannels] = React.useState([]);
  const socket = React.useContext(SocketContext);
  const {channelToUse,setNotification} = props;
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
    channelToUse(channels[newValue]);
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
            setNotification("Mise à jour de vos channels réussis");
            setChannels(data.channels);
        }else{
            setNotification('Erreur dans la mise à jour de vos channels');
        }
    });
    //nick
    socket.on("nickname update", function(data) {
      if(data.success === "success"){
          setNotification("Your nickname has been updated");
          user.username = data.username;
          localStorage.setItem("auth", JSON.stringify(user));
      }else{
          setNotification('Update of your nickname failed');
      }
  });
        socket.on("joinChannel", function(data) {
          if(data.success === "success"){
            setNotification(" You are join channel " + data.channel_name);
            getChannels();
          }else{
              setNotification("The name of channel don't exist ");
          }
      });
      socket.on("leaveChannel", function(data) {
        if(data.success === "success"){
            setNotification("You are leave channel " + data.channel_name);
            getChannels();
        }else{
            setNotification("Channel don't exist or you have not joined this channel");
        }
       });
       socket.on("deleteChannel", function(data) {
        if(data.success === "success"){
            setNotification("You are delete channel " + data);
            getChannels();
        }else{
            setNotification("Channel don't exist");
        }

    });
    socket.on("listChannel", function(data) {
      if(data.success === "success"){
          setNotification("channel " + data.channels);
      }else{
          setNotification("we have. no channel with this name");
      }
  });
    socket.on("privatemsg", function(data) {
      if(data.success === "success"){
          setNotification("you have send message");
      }else{
          setNotification("message not send");
      }
  });
    socket.on("add channel", function(msg) {
      setNotification("You have create " + msg + " channel");
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
            <TabPanel value={value} index={index} key={"tab-panel-" + index} className={classes.tab_panel}>
              <h3>{channel}</h3>
              <ChatMessage channel={channel} />
            </TabPanel>
          )
      })}
    </div>
  );
}
