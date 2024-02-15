
export const formatAddress = (value) => {
    
    return value.substring(0,10) + "..." + value.substring(value.length -3,);
  }
  export const formatString = (value) => {
   
    return value.substring(0,28) + "..." + value.substring(value.length -14,);
  }
  export const formatMString = (value) => {
   
    return value.substring(0,15) + "..." + value.substring(value.length -8,);
  }
  export const handleCopy = (value) => {
    navigator.clipboard.writeText(value).then(
      () => {
       
        alert('address copied to clip Board')
      },
      (err) => {
        // Failed to copy to clipboard
        console.error('Could not copy address: ', err);
      }
    );
  }
  
  export const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
  
    // Extract the different parts of the date
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes().toString().padStart(2, '0');
    const amPm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12; // Convert 24h to 12h format
  
    // Format the date as "Dec 14, 2023, 6:23 PM"
    const formattedDate = `${month} ${day}, ${year}, ${formattedHour}:${minute} ${amPm}`;
  
    return formattedDate;
  }