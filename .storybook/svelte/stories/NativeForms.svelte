<script lang="ts">
  import { Button, Checkbox, Switch, TextInput } from '@krds-community/svelte';

  let name = $state('');
  let termsChecked = $state(false);
  let notificationsEnabled = $state(true);
  let submitted = $state(false);

  const submit = (event: SubmitEvent) => {
    event.preventDefault();
    submitted = true;
  };
</script>

<form aria-label="프로필 입력" onsubmit={submit} style="display:grid;gap:1rem;max-width:32rem">
  <TextInput
    id="svelte-native-name"
    label="이름"
    hint="실명을 입력하세요."
    bind:value={name}
    required
  />
  <Checkbox
    id="svelte-native-terms"
    label="약관에 동의합니다."
    name="terms"
    bind:checked={termsChecked}
    required
  />
  <Switch
    id="svelte-native-notifications"
    label="알림 받기"
    name="notifications"
    bind:checked={notificationsEnabled}
  />
  <Button type="submit">제출</Button>
  <p role="status" aria-live="polite">
    {#if submitted}
      {name || '이름 없음'} · 약관 {termsChecked ? '동의' : '미동의'} · 알림 {notificationsEnabled ? '켜짐' : '꺼짐'}
    {:else}
      입력 후 제출해 주세요.
    {/if}
  </p>
</form>
