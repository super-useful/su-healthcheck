module.exports.getSchema = function (schema) {
    return "SELECT routine_type as type, routine_name as name FROM information_schema.routines WHERE specific_schema NOT IN"
        + "\n('pg_catalog', 'information_schema') AND type_udt_name != 'trigger'"
        + "\nUNION"
        + "\nselect table_type as type, table_name as name from information_schema.tables where table_schema='" + (schema || 'public') + "'";
}
