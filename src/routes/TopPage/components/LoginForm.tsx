import React, { useState } from "react";
import { TextField, Button, Checkbox, FormControlLabel, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LoginForm: React.FC = () => {
  const [uid, setUid] = useState<string>("");
  const [voicerec, setVoicerec] = useState<boolean>(false);
  const [imgtak, setImgtak] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const handleLogin = () => {
    if (uid.trim() === "") {
      setError("You-IDを入力してください。");
      return;
    }
    setError("");
    const queryParams = new URLSearchParams({
      uid: uid,
      voicerec: voicerec.toString(),
      imgtak: imgtak.toString(),
    });
    navigate(`/keicho?${queryParams.toString()}`);
  };

  const handleCheckboxChange =
    (setter: React.Dispatch<React.SetStateAction<boolean>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setter(event.target.checked);
    };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        ログイン
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TextField
        label="You-ID"
        variant="outlined"
        fullWidth
        value={uid}
        onChange={(e) => setUid(e.target.value)}
        margin="normal"
      />
      <FormControlLabel
        control={<Checkbox checked={voicerec} onChange={handleCheckboxChange(setVoicerec)} />}
        label="音声を録音する"
      />
      <FormControlLabel
        control={<Checkbox checked={imgtak} onChange={handleCheckboxChange(setImgtak)} />}
        label="写真を撮影する"
      />
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleLogin}>
          ログイン
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => setUid("")} sx={{ ml: 2 }}>
          クリア
        </Button>
      </Box>
    </Box>
  );
};

export default LoginForm;
