import React, { useState } from "react";
import { TextField, Button, Checkbox, FormControlLabel, Typography, Box } from "@mui/material";

const LoginForm: React.FC = () => {
  const [error, setError] = useState("");
  const {uid, setUid, voicerec, setVoicerec, imgtak, setImgtak, keicho, setKeicho, seicho, setSeicho } = useAppContext();

  const handleLogin = () => {
    // ログイン処理を追加
    if (!uid) {
      setError("無効なIDです");
    } else {
      // URLパラメータの生成
      const urlParams = `uid=${uid}&voicerec=${voicerec ? "yes" : "no"}&imgtak=${imgtak ? "yes" : "no"}&keicho=${keicho ? "yes" : "no"}&seicho=${seicho ? "yes" : "no"}`;
      console.log(urlParams);
      // ログイン成功後のページ遷移
      window.location.href = `keicho.html?${urlParams}`;
    }
  };

  const handleCheckboxChange = (setter) => (event) => {
    setter(event.target.checked);
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        ログイン
      </Typography>
      <Typography color="error">{error}</Typography>
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
      <FormControlLabel
        control={<Checkbox checked={keicho} onChange={handleCheckboxChange(setKeicho)} />}
        label="傾聴モードで開始する"
      />
      <FormControlLabel
        control={<Checkbox checked={seicho} onChange={handleCheckboxChange(setSeicho)} />}
        label="静聴モードで開始する"
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
}

export default LoginForm;
