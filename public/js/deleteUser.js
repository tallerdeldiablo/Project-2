document.querySelectorAll('.delete-user').forEach((button) => {
  button.addEventListener('click', async () => {
    const name = button.dataset.userName;
    if (!confirm(`Delete ${name} and all assigned tasks?`)) return;

    button.disabled = true;
    try {
      const response = await fetch(`/api/users/${button.dataset.userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Could not delete user');
      window.location.reload();
    } catch (error) {
      button.disabled = false;
      alert(error.message);
    }
  });
});
