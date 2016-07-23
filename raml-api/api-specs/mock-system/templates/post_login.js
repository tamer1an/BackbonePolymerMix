var issued = faker.date.future(),
    expired = faker.date.future();

module.exports = {
    "command" : "login",
    "index" : 0,
    "read_commands" : [
        "get_profile_list",
        "get_admin_profile_list",
        "get_callrec_profile_list",
        "get_paging_profile_list",
        "get_status",
        "get_user_list",
        "get_device_list",
        "get_device_profile_details",
        "get_device_profile_list",
        "get_device_assoc_list",
        "get_locations",
        "get_chr_list",
        "get_vmnr_list"
    ],
    "session" : "73bf180f-f172-45c6-8f00-a8eb99dad045",
    "write_commands" : [
        "add_device",
        "update_device",
        "delete_device",
        "update_device_cfg",
        "add_user",
        "update_user",
        "delete_user",
        "assign_device",
        "unassign_device",
        "assign_devices",
        "assign_users",
        "add_chr",
        "update_chr",
        "delete_chr",
        "add_vmnr",
        "update_vmnr",
        "delete_vmnr"
    ]
};
